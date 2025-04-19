const { initalContent } = require('./initalContent');

const env = process.env.REACT_APP_STAGE;

const baseUrl =
  // eslint-disable-next-line no-nested-ternary
  env === 'dev'
    ? 'https://api-dev.bicyclebluebook.com'
    : env === 'staging'
    ? 'https://api-staging.bicyclebluebook.com'
    : 'https://api.bicyclebluebook.com';
const EXTERNAL_DATA_URL = `${baseUrl}/core/api/sitemap/export`;
const createSitemap = (posts) => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${initalContent}${
  env !== 'production'
    ? posts
        .map((item) => {
          return `
            <url><loc>${item}</loc></url>
            `;
        })
        .join('')
    : ''
}
    </urlset>
    `;

async function fetchSitemap() {
  const request = await fetch(EXTERNAL_DATA_URL);
  const posts = await request.json();
  return createSitemap(posts);
}

module.exports = {
  fetchSitemap,
};
