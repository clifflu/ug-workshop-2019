FROM node

WORKDIR /app

COPY package.json package-lock.json index.js ./
RUN npm install
EXPOSE 8080

CMD npm run start

