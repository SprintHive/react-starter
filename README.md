# React starter (overlord)

An proof of concept with examples of how different user cases could be implemented using event sourcing.

## Get Node

I recommend using nvm to manage the different versions of node on your machine.

    # From https://github.com/creationix/nvm
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash
    
    # Install node with nvm
    nvm install v8.9.4
     
## Get Yarn

Browse to the following link and follow the instructions
    
    https://yarnpkg.com/en/docs/install    
    

## Install the npm dependencies

From the project root run ```yarn```
From the <project_root>/client directory run ```yarn```

## Get the app up and running

When developing the application is made up of 3 parts: 

* the webpack dev server
* the back end for a font end aka bff
* the api gateway aka horton

Each of these processes will be run in different terminals. 

> These commands must be run from the project root.

    # Temnial 1 - start the bff 
    yarn horton  
    
    # Terminal 2 - start horton
    yarn cqrs
    
    # Terminal 3 - start the webpack dev server
    yarn server

    # Terminal 4 - start the webpack dev server
    yarn client

### Create kafka topics 

From the kafka home directory run

    bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic event-source
    bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dob-captured
    bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic entity-updated

## Deployment

We use docker to deploy the application.

### Bundling the client for production

    yarn build-client
    
### Test the server in production mode
    
    # Start the sever with NODE_ENV=production
    yarn build-client
    yarn server-prod
    
    # browse to http://localhost:3006
    
### Building the docker image

    # Building the docker image
    docker -t react-starter:v0.1 .
    
### Testing the docker image

    # Running the docker image in a container
    docker run --name react-starter --rm -i react-starter:v0.1 

    # Then browse to http://localhost:3006    
    
    # To stop the docker container
    docker stop react-starter 
    
### The Jenkinsfile 

This is a very simple step for now it just builds the docker image and publishes it to the minikube docker registry.    