# Use `volumes` to make part-two/processor/ available at /processor
# And then again with simply "/processor/node_modules" to avoid
# overwriting the container's node modules with the host's.

FROM node:8

WORKDIR /processor

COPY package.json .

RUN npm install

ENTRYPOINT ["/usr/local/bin/node", "index.js"]
