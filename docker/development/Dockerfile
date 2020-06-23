FROM node:12

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN yarn

COPY . .

CMD ["yarn", "dev"]