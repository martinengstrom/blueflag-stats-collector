FROM node:12-alpine
RUN mkdir -p /srv
WORKDIR /srv
COPY package.json /srv/package.json
RUN npm install
COPY collector.js /srv/collector.js
COPY main.js /srv/main.js
CMD node /srv/main.js

