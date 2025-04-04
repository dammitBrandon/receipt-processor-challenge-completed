FROM node:22.2.0-alpine
LABEL authors="BBAILEY"

RUN mkdir -p /usr/src/app
ENV PATH=/usr/src/app/node_modules/.bin:$PATH
# Everything under WORKDIR will assume your container destination is this directory
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install --quiet

COPY ./ ./

EXPOSE 3000

# Start Application
CMD ["node", "server/server" ]