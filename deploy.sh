#!/bin/bash

# add executing permissions to our build scripts @ 
# runtime since they were likely overritten by the git pull
chmod 700 ./deploy_api.sh
cmhod 700 ./deploy_frontend.sh

yarn
yarn build:api
yarn build:frontend

pm2 start