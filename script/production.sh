#!/usr/bin/env bash
echo '~~~~~~ Starting build production bbb-web-v3 ~~~~~~~~~'
yarn build:production

echo '~~~~~~ Starting build dockerfile ~~~~~~~~~~'
ENV=production
HOST=507406836182.dkr.ecr.us-east-1.amazonaws.com
IMAGE=bbb-web-v3

cd ../ && docker build -t $HOST/$IMAGE:$ENV -f .docker/$ENV.dockerfile .

echo '~~~~~~ Ending build dockerfile ~~~~~~~~~~'
