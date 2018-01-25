# React starter

An example of a react js app configured to deployed with ship.

## Install Deps

    git clone git@github.com:SprintHive/react-starter.git
    cd react-starter
    yarn install
    cd client
    yarn install

## Get up and running

The following commands are to be run from the project root.

The basic dev workflow is to open 2 terminals and run the client in one and the server in the other.

    # Start the client 
    yarn client 
    
    # Start the sever 
    yarn server

Now browse to http://localhost:3000

## Bundling the client for production

    # Change to the client dir
    cd client
    yarn build
    
To test the server can server the production build start the server with NODE_ENV=production
    
    # Start the sever with NODE_ENV=production
    yarn server-prod
    
## Building the docker image

    # Building the docker image
    docker -t react-starter:v0.1 .
    
## Testing the docker image

    # Running the docker image in a container
    docker run --name react-starter --rm -i react-starter:v0.1 

    # Then browse to http://localhost:3006    
    
    # To stop the docker container
    docker stop react-starter 
    
## The Jenkinsfile 

This is a very simple step for now it just builds the docker image and publishes it to the minikube docker registry.    
