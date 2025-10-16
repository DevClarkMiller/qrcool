@Library('pipeline-lib') _

pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    parameters {
        booleanParam(
            name: 'FORCE_FRONTEND',
            defaultValue: false,
            description: 'Force frontend stage to run even if no changes detected'
        )
        booleanParam(
            name: 'FORCE_BACKEND',
            defaultValue: false,
            description: 'Force backend stage to run even if no changes detected'
        )
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Install Dependencies Frontend") {
            when { 
                anyOf {
                    changeset "frontend/**"
                    changeset "Jenkinsfile"
                    expression { return params.FORCE_FRONTEND }
                }
            }
            steps {
                dir('frontend/QrCool') {
                    sh 'NODE_ENV=development npm ci'
                    loadEnvFile('qrcool', 'frontend', 'staging')
                    loadEnvFile('qrcool', 'frontend', 'production')
                }
            }
        }

        stage("Install Dependencies Backend") {
            when { 
                anyOf {
                    changeset "backend/**"
                    changeset "Jenkinsfile"
                    expression { return params.FORCE_BACKEND }
                }
            }
            steps {
                dir('backend') {
                    sh "npm install"
                    
                    loadEnvFile('qrcool', 'backend', 'development')
                    loadEnvFile('qrcool', 'backend', 'production')
                }
            }
        }

        stage ("Build Frontend") {
            when { 
                anyOf {
                    changeset "frontend/**"
                    changeset "Jenkinsfile"
                    expression { return params.FORCE_FRONTEND }
                }
            }
            steps {
                dir('frontend/QrCool') {
                    sh "npm run build:prod"
                }
            }
        }

        stage("Build Backend") {
            when { 
                anyOf {
                    changeset "backend/**"
                    changeset "Jenkinsfile"
                    expression { return params.FORCE_BACKEND }
                }
            }
            steps {
                dir('backend') {
                    sh 'npm run build:image'
                }
            }
        }

        stage("Test") {
            when { 
                anyOf {
                    changeset "backend/**"
                    changeset "Jenkinsfile"
                    expression { return params.FORCE_BACKEND }
                }
            }
            steps {
                dir('backend') {
                    runAndDeleteContainer('qrcoolimage', './testEntrypoint.sh')
                }
            }
        }

        stage("Deploy Frontend") {
            when { 
                anyOf {
                    changeset "frontend/**"
                    changeset "Jenkinsfile"
                    expression { return params.FORCE_FRONTEND }
                }
            }
            steps {
                dir('frontend/QrCool') {
                    withCredentials([
                    string(credentialsId: 'vps-username', variable: 'USERNAME'),
                    string(credentialsId: 'vps-domain', variable: 'DOMAIN')
                    ]) {
                        scpBuildFilesToWWW(USERNAME, DOMAIN, 'qrcool.ca')
                        updateNginxConf(USERNAME, DOMAIN, 'qrcool.ca')
                        certify(USERNAME, DOMAIN, 'site.qrcool.ca')
                    }
                }
            }
        }

        stage("Deploy Backend") {
            when { 
                anyOf {
                    changeset "backend/**"
                    changeset "Jenkinsfile"
                    expression { return params.FORCE_BACKEND }
                }
            }
            steps {
                // We don't need to transfer over the tar file since the node is on the same machine
                // dir('backend') {
                //     sh 'npm run save:image'
                //     sh 'scp qrcoolimage.tar miller@sys1.clarkmiller.ca:/home/miller'
                //     sh 'ssh sys1.clarkmiller.ca "docker load -i qrcoolimage.tar"'
                //     sh 'ssh sys1.clarkmiller.ca "docker compose stop qrcool ; docker compose rm -f qrcool; docker compose up -d qrcool"'
                // }
                sh 'ssh sys1.clarkmiller.ca "docker compose stop qrcool ; docker compose rm -f qrcool; docker compose up -d qrcool"'
            }
        }
    }
}