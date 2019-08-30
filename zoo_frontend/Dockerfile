FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm run build-docker

CMD [ "npm" , "run", "start-docker" ]
