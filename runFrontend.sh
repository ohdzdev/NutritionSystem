#!/bin/bash
# for next 8.0.4+ they changed their start script functionality and sort of broke it with pm2
# need to run via shell script which removes clusterizing :(

export NODE_ENV=production
cd ./zoo_frontend

../node_modules/next/dist/bin/next start
