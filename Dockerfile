FROM node:lts-alpine as builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY client/package.json ./client/
COPY client/yarn.lock ./client/

RUN yarn run init-all

COPY . .

RUN yarn run client:build && \
  mv client/build/ . && \
  rm -rf client/ && \
  yarn run server:build && \
  mv server/dist/ . && \
  rm -rf server/

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app .

EXPOSE 5000

CMD ["yarn", "run", "server:prod"]