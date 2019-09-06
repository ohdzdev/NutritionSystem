FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN chmod 770 ./lib/DietAnalysisExport/bin/ExcelApp

CMD [ "npm" , "start" ]
