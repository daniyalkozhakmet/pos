FROM node:22.5.1-alpine

WORKDIR /app/seeder

COPY package.json .

RUN npm install

COPY . .

CMD ["node", "seeder.js"]

