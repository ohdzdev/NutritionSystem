FROM node:10

WORKDIR /usr/src/app

COPY . .

RUN chmod 770 ./zoo_api/lib/DietAnalysisExport/bin/ExcelApp

RUN yarn install --prod

WORKDIR /usr/src/app/zoo_frontend

RUN yarn build-docker

WORKDIR /usr/src/app

CMD [ "node" , "start.js"]
