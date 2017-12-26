#!/usr/bin/groovy
@Library('github.com/SprintHive/sprinthive-pipeline-library')

def componentName = 'react-starter'
def versionTag = ''
def resourcesDir = 'config/kubernetes'
def dockerImage

gradleNode(label: 'nodejs-and-docker') {
    stage('Compile source') {
        checkout scm
        versionTag = getNewVersion {}
        dockerImage = "${componentName}:${versionTag}"
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
                readFile(resourcesDir + '/service.yaml')
            ]
            stage = deployStage
            version = versionTag
            image = dockerImage
            name = componentName
            host = componentName + ".192.168.99.100.nip.io"
        }

        for (String kubeResource : kubeResources) {
            kubernetesApply(file: kubeResource, environment: namespace)
        }
    }
}
