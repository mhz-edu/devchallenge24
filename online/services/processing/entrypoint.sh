#!/usr/bin/env bash

/usr/src/app/wait-for-it.sh api:3000 -t 120
npm run train
npm run start:prod