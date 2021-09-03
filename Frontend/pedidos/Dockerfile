FROM node:16

WORKDIR WORKDIR /usr/src/app

COPY ./package.json ./

COPY ./yarn.lock ./

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]

