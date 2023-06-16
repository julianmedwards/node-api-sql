ARG NODE_VERSION

FROM node:$NODE_VERSION

WORKDIR /usr/src/api

COPY package.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "start-prod" ]