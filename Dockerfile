FROM node:12-alpine as build
RUN mkdir /frontend
WORKDIR /frontend
COPY ./react /frontend
RUN yarn install
RUN yarn build

FROM php:7.3-apache
COPY --from=build /frontend/build /var/www/html
COPY ./php /var/www/html/psignapi
RUN mkdir data && cd data && mkdir protonsign && cd protonsign && mkdir docinfo && mkdir uploads
EXPOSE 8080
