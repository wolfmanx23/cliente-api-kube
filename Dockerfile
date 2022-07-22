FROM node:18
COPY server.js .
COPY package.json .
COPY / .
RUN npm install npm@8.15.0
RUN npm install request@2.88.2 --save
EXPOSE  3000
CMD ["node", "server.js"]
