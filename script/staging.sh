#!/usr/bin/env bash
echo '~~~~~~ Starting build staging bbb-web-v3 ~~~~~~~~~'
yarn build:staging

echo '~~~~~~ Starting build dockerfile ~~~~~~~~~~'
ENV=staging
HOST=507406836182.dkr.ecr.us-east-1.amazonaws.com
IMAGE=bbb-web-v3

cd ../ && docker build -t $HOST/$IMAGE:$ENV -f .docker/$ENV.dockerfile .

echo '~~~~~~ Ending build dockerfile ~~~~~~~~~~'
