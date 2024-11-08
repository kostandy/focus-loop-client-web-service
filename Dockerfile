FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3037

RUN npm run build

CMD ["node", ".output/server/index.mjs"]