FROM mhart/alpine-node:base-8

# Copy the react app
WORKDIR /app/client/build
COPY client/build .

# Copy all the server dependencies
WORKDIR /app/node_modules
COPY node_modules .

# Copy the whole server
WORKDIR /app/server
COPY server .

EXPOSE 7001

WORKDIR /app
RUN ls -l

CMD NODE_ENV=production DEBUG=sprinthive:* PORT=7001 node server/server.js