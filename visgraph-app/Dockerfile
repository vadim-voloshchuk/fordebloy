# Use an official Node runtime as a parent image
FROM node:14

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]