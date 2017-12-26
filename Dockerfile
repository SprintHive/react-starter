FROM mhart/alpine-node:8 as buildroom

# Copy the whole repo into the app folder
WORKDIR /app
COPY . .

# Use yarn to create a production version of our react app
WORKDIR /app/client
RUN yarn build

# Use yarn to make sure all our server dependencies are installed
WORKDIR /app
RUN yarn install --production

# Copy only the files we want from the build room to create our final image
# Note the final image is created from "base" so no build tools are included
FROM mhart/alpine-node:base-8

# Copy the react app
WORKDIR /app/client/build
COPY --from=buildroom /app/client/build .

# Copy all the server dependencies
WORKDIR /app/node_modules
COPY --from=buildroom /app/node_modules .

# Copy the whole server
WORKDIR /app/server
COPY --from=buildroom /app/server .

EXPOSE 3006

WORKDIR /app
RUN ls -l

CMD NODE_ENV=production DEBUG=sprinthive:* PORT=3006 node server/server.js