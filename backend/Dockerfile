FROM node:16.1.0-alpine3.12 as builder

COPY . ./app

WORKDIR /app

EXPOSE 9000

RUN ls -a

RUN  npm install && \
     npm run build

CMD [ "node", "./build/server.js" ]
