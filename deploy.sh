#!/bin/bash

# set node_env to production for next js and possibly loopback
export NODE_ENV=production

# build the frontend and api
yarn
yarn build:frontend

# run the frontend and api
pm2 delete all
pm2 start ./ecosystem.config.js -- env production

echo ---------------------------------
echo .
echo API available on localhost:8080 /api /explorer
echo frontend available on localhost:3000
echo .
echo ---------------------------------