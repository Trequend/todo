FROM node:16.10-alpine3.11

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . ./

ENV NODE_ENV=production

RUN yarn build

EXPOSE 8000

CMD yarn start
