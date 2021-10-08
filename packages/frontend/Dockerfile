# Build environment
FROM node:16.10-alpine3.11 as build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

ARG PUBLIC_URL
ARG API_URL

ENV PUBLIC_URL=${PUBLIC_URL} \
    REACT_APP_API_URL=${API_URL} \
    NODE_ENV=production

COPY . ./

RUN yarn build

# Production environment
FROM nginx:1.21.3-alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
