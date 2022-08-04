# IMG Server
A image optimization server, made quick and simple :)

## Before running
* Run `yarn` or `yarn install` 
* Create a .env file (see `.env.example`)

## Start server
1. `yarn build`
2. `yarn start`

## Debug
* *`yarn dev`

## Dev redis server
* Run `docker run -d -e REDIS_PASSWORD=password -p 6379:6379 bitnami/redis`