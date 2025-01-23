
FROM node:alpine

WORKDIR /app

RUN mkdir /app/middleware

RUN mkdir /app/routes

RUN mkdir /app/test_generator

COPY package.json /app

COPY package-lock.json /app

RUN npm install

COPY .env /app

RUN mkdir /app/uploads

COPY routes /app/routes

COPY middleware /app/middleware

COPY test_generator /app/test_generator

COPY index.js /app

COPY jobquery.txt /app

COPY resume.pdf /app

COPY utils.js /app

CMD ["node", "index.js"]