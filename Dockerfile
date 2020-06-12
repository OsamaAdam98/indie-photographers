FROM node

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY client/package.json ./client/
COPY client/yarn.lock ./client/

RUN yarn run init-all

COPY . .

RUN yarn run client:build
RUN mv client/build/ .
RUN rm -rf client/
RUN yarn run server:build
RUN mv server/dist/ .
RUN rm -rf server/

EXPOSE 5000

CMD ["yarn", "run", "server:prod"]