FROM node:12

WORKDIR /usr/src/app

COPY . .

RUN yarn install --prod

WORKDIR /usr/src/app/zoo_frontend

RUN yarn build-docker

WORKDIR /usr/src/app

RUN chmod 770 ./zoo_api/lib/DietAnalysisExport/bin/ExcelApp

CMD [ "node" , "start.js"]
