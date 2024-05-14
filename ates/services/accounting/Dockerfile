FROM node:18

WORKDIR /app

COPY ./package*.json ./
COPY ./tsconfig.* ./

RUN  npm install
RUN  npm run build

EXPOSE 3000 9229