FROM node:18
COPY server.js .
COPY package.json .
COPY / .
RUN npm install -g npm@8.15.0
RUN npm install request --save
EXPOSE  3000
CMD node server.js
