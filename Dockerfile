FROM node:lts-alpine

# TODO: Add ENV variables

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3037

RUN npm run generate

CMD ["node", ".output/server/index.mjs"]