#!/bin/bash

# build the frontend and api
yarn
yarn build:api
yarn build:frontend

# run the frontend and api
pm2 start ./ecosystem.config.js

echo ---------------------------------
echo .
echo API available on localhost:3333 /api /explorer
echo frontend available on localhost:3000
echo .
echo ---------------------------------