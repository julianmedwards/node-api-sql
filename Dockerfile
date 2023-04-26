ARG NODE_VERSION

FROM node:$NODE_VERSION

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

ARG DATABASE_NAME
ARG DATABASE_HOST
ARG DATABASE_USERNAME
ARG DATABASE_PASSWORD
ARG DATABASE_PORT

ENV DATABASE_NAME=$DATABASE_NAME
ENV DATABASE_HOST=$DATABASE_HOST
ENV DATABASE_USERNAME=$DATABASE_USERNAME
ENV DATABASE_PASSWORD=$DATABASE_PASSWORD
ENV DATABASE_PORT=$DATABASE_PORT

WORKDIR /usr/src/api

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "run", "start-prod" ]