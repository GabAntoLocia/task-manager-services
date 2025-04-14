FROM node:18-alpine

WORKDIR /app

# Copiar package.json y lock desde raíz y del microservicio
COPY ../../package*.json ./
COPY ./package*.json ./apps/task-service/

# Copiar libs y common
COPY ../../libs ./libs
COPY ../../common ./common

# Instalar dependencias
RUN npm install

# Copiar el código del microservicio
COPY . .

EXPOSE 3002
CMD ["npm", "run", "start"]