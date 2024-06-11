# Use an official Node runtime as a parent image
FROM node:14

WORKDIR /app

COPY . /app

RUN npm install

npm install vis-data

ls node_modules/vis-data

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]