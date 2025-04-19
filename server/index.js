const express = require('express');
const next = require('next');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const ip = require('ip');
const LRUCache = require('lru-cache');
const redirectV2Router = require('./redirectFromV2');
const fs = require('fs');
const path = require('path');
const { fetchSitemap } = require('./siteMapHelper');

const port = process.env.PORT || 3000;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

const removeTrailingSlash = (req, res, goNext) => {
  if (req.url !== '/') {
    req.url = req.url.replace(/\/$/, '').replace(/\/\?/, '?');
  }
  goNext();
};

const useV2 = process.env.USE_V2 !== 'false';
const ssrCache = new LRUCache({
  max: 500,
  maxSize: 5000,
  sizeCalculation: (value, key) => {
    return 1;
  },
  ttl: 1000 * 60 * 5,
  allowStale: false,
  updateAgeOnGet: false,
  updateAgeOnHas: false,
});
function getCacheKey(req) {
  return `${req.path}`;
}

async function renderAndCache(req, res) {
  const key = getCacheKey(req);

  // If we have a page in the cache, let's serve it
  if (ssrCache.has(key)) {
    // console.log(`serving from cache ${key}`);
    res.setHeader('x-cache', 'HIT');
    res.send(ssrCache.get(key));
    return;
  }

  try {
    // console.log(`key ${key} not found, rendering`);
    // If not let's render the page into HTML
    const html = await app.renderToHTML(req, res, req.path, req.query);

    // Something is wrong with the request, let's skip the cache
    if (res.statusCode !== 200) {
      res.send(html);
      return;
    }

    // Let's cache this page
    ssrCache.set(key, html);

    res.setHeader('x-cache', 'MISS');
    res.send(html);
  } catch (err) {
    app.renderError(err, req, res, req.path, req.query);
  }
}
/* eslint-disable no-console */
(async () => {
  console.clear();
  console.log('💣 Starting server with ', { port, dev: process.env.NODE_ENV });
  console.log('_____________________________________________________________');
  await app.prepare();
  const server = express();
  server.use(cookieParser());
  server.use(morgan('dev'));
  server.use(helmet());
  server.use(compression());
  // server.use(removeTrailingSlash);
  server.use(redirectV2Router);

  server.use((req, res, goNext) => {
    if (req.url.includes('/images/') || req.url.includes(`/_next/static`)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    goNext();
  });

  // region Router for express server
  // if (useV2) {
  //   server.use('/trade-in-account/*', express.static('_v2'));
  //   server.use('/trade-in-account/', express.static('_v2'));
  //   server.get('*.*', express.static('_v2'));
  // }
  server.get('*.*', express.static('public'));

  // endregion

  // region Custom Router for next js app
  // server.get('/login', (req, res) => {
  //   const realPath = '/';
  //   return app.render(req, res, realPath, { login: 'true', ...req.query });
  // });
  server.get('/contact', (req, res) => {
    const realPath = '/';
    return app.render(req, res, realPath, { contact: 'true', ...req.query });
  });
  server.get('/partnerdetails.aspx', (req, res) => {
    // this router for ignore case sensitive
    const realPath = '/partnerdetails.aspx';
    return app.render(req, res, realPath, req.query);
  });
  server.get(
    ['/api/v1/health/kube-startup', '/api/v1/health/kube-liveness', '/api/v1/health/kube-readiness'],
    (req, res) => {
      const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
      };
      try {
        res.send(healthcheck);
      } catch (e) {
        healthcheck.message = e;
        res.status(503).send();
      }
    },
  );
  // endregion
  server.get('/_next/*', (req, res) => {
    /* serving _next static content using next.js handler */
    handle(req, res);
  });

  server.get(['/', '/marketplace/*'], (req, res) => {
    /* serving page */
    if (req.headers.cookie) {
      const token = req.headers.cookie.split(';').find((i) => i.split('=').shift().trim() === '__token');
      if (token) {
        return handle(req, res);
      }
    }
    return renderAndCache(req, res);
  });

  server.get('/sitemap.xml', async (req, res) => {
    const htmlPath = path.join(__dirname, '../.next/sitemap.xml');
    res.setHeader('Content-Type', 'text/xml');
    const existed = fs.existsSync(htmlPath);
    if (existed) {
      fs.stat(htmlPath, async (err, stats) => {
        if (err) {
          return handle(req, res);
        }
        if (+new Date(stats.mtime) + 8.64e7 < Date.now()) {
          console.log('Cache invalid');
          const html = await fetchSitemap();
          res.send(html);
          fs.writeFile(htmlPath, html, (e) => {
            if (e) {
              console.log('error write file inner', e);
            }
          });
        } else {
          console.log('Cache hit');
          res.sendFile(htmlPath);
        }
      });
    } else {
      const html = await fetchSitemap();
      res.send(html);
      fs.writeFile(htmlPath, html, (e) => {
        if (e) {
          console.log('error write file', e);
        }
      });
    }
  });

  server.get('*', (req, res) => {
    /* serving _next static content using next.js handler */
    handle(req, res);
  });
  await server.listen(port);
  const envName = process.env.NODE_ENV !== 'production' ? 'development' : 'production';
  console.clear();
  console.log(`✅ Start server successfully!`);
  console.log(`🟢 Environment: ${envName}`);
  console.log(`🟡 Host: \n\t http://localhost:${port}\n\t http://${ip.address()}:${port}`);
  if (useV2) {
    console.log(`🔵 V2: http://localhost:${port}/trade-in-account/`);
  }
})();
