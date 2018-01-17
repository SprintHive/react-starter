# React starter

An example of a react js app configured to deployed with ship.

## Get Node

I recommend using nvm to manage the different versions of node on your machine.

    # From https://github.com/creationix/nvm
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash
    
    # Install node with nvm
    nvm install v8.1.2
     
## Get Yarn

Browse to the following link and follow the instructions
    
    https://yarnpkg.com/en/docs/install    
    

## Progress so far

The following commands are to be run from the project root.

The basic dev workflow is to open 3 terminals and run the client, the server and horton.

    # Start the client 
    yarn client 
    
    # Start the sever 
    yarn server

    # Start horton 
    yarn horton

Bundling the client for production

    # Change to the client dir
    cd client
    yarn build
    
To test the server can server the production build start the server with NODE_ENV=production
    
    # Start the sever with NODE_ENV=production
    yarn server-prod
    
Building the docker image

    # Building the docker image
    docker -t react-starter:v0.1 .
    
Testing the docker image

    # Running the docker image in a container
    docker run --name react-starter --rm -i react-starter:v0.1 

    # Then browse to http://localhost:3006    
    
    # To stop the docker container
    docker stop react-starter 
    
The Jenkinsfile 

This is a very simple step for now it just builds the docker image and publishes it to the minikube docker registry.    