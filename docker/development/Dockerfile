FROM node:12-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN yarn

COPY . .

CMD ["yarn", "run", "dev"]