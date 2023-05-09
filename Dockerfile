FROM node:16.17.0-alpine as front

WORKDIR /app/front

COPY front/package.json /app/front/

RUN npm install

COPY front /app/front/

RUN npm run build

FROM node:16.17.0-alpine

WORKDIR /app

COPY back/package.json /app

RUN npm install

COPY back /app

COPY --from=front /app/front/build /app/front

EXPOSE 4000

CMD [ "npm", "start" ]