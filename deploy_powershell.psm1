
#  build the frontend and api
yarn
yarn build:api
yarn build:frontend

#   run the frontend and api
pm2 start ./ecosystem.config.js