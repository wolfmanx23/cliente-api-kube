FROM node:10
COPY server.js .
COPY package.json .
COPY / .
RUN npm install
RUN npm install request --save
EXPOSE  3000
CMD node server.js
