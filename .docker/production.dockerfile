FROM public.ecr.aws/v0d1y2i1/node:14.21.2
LABEL author="manh.nguyen@vmodev.com"

RUN mkdir -p /home/bbb-web-v3
WORKDIR /home/bbb-web-v3

# caching package & ecosystem
COPY ecosystem-production.config.js ./
COPY package.json ./

RUN yarn install --production

COPY server ./server
COPY next.config.js ./
COPY plugins ./plugins
COPY public ./public

COPY .next ./.next
EXPOSE 3002

ENTRYPOINT [ "pm2-runtime","start","ecosystem-production.config.js" ]
