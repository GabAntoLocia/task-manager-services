FROM node:18-alpine

WORKDIR /app

COPY ../../package*.json ./
COPY ./package*.json ./apps/task-manager-services/

COPY ../../libs ./libs
COPY ../../common ./common
COPY ../../dist ./dist

RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start"]