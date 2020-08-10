FROM buildkite/puppeteer as builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN yarn

COPY . .

RUN yarn run client:build && \
  yarn run server:build && \
  mv client/build/ . && \
  rm -rf client/ && \
  rm -rf server/src && \
  yarn --prod

FROM node:12-alpine

WORKDIR /app

COPY --from=builder /app .

EXPOSE 5000

CMD ["yarn", "run", "server:prod"]