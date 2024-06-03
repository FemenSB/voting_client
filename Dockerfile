FROM node:21.6.2-alpine

EXPOSE 3000

WORKDIR /code

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

CMD [ "npm", "run", "start" ]
