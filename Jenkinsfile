#!/usr/bin/groovy
@Library('github.com/SprintHive/sprinthive-pipeline-library@nodejs')

def componentName = 'react-starter'
def versionTag = ''
def resourcesDir = 'config/kubernetes'
def dockerImage

nodejsNode(label: 'nodejs-and-docker') {
    stage('Compile source') {
        checkout scm
        versionTag = getNewVersion {}
        dockerImage = "${componentName}:${versionTag}"

        container(name: 'nodejs') {
            sh "cd client; yarn install; yarn run build"
            sh "yarn install --production"
        }
    }

    stage('Build docker image') {
        container('docker') {
            sh "docker build -t ${dockerImage} ."
        }
    }

    stage('Rollout to Local') {
        def namespace = 'local'
        def deployStage = 'development'

        def kubeResources = kubeResourcesFromTemplates {
            templates = [
                readFile(resourcesDir + '/deployment.yaml'),
                readFile(resourcesDir + '/service.yaml'),
                readFile(resourcesDir + '/ingress.yaml')
            ]
            stage = deployStage
            version = versionTag
            image = dockerImage
            name = componentName
        }

        for (String kubeResource : kubeResources) {
            kubernetesApply(file: kubeResource, environment: namespace)
        }
    }
}
