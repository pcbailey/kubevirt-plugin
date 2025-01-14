FROM node:16 AS build

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN yarn install && yarn build

FROM nginxinc/nginx-unprivileged

USER root
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
