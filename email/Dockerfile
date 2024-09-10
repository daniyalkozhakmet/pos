FROM node

WORKDIR /app/admin

COPY package.json .

RUN npm install

COPY . .

# RUN node ./src/database/seeders/user-seeder.js

EXPOSE 8005

CMD ["npm", "start"]
