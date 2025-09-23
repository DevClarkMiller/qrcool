pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    def frontendChanges() {
        return (
            changeset "frontend/**" ||
            changeset "Jenkinsfile"
        )
    }

    def backendChanges() {
        return (
            changeset "backend/**"
        )
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Install Dependencies Frontend") {
            when { expression frontendChanges() }
            steps {
                dir('frontend/QrCool') {
                    sh 'NODE_ENV=development npm ci'
                    withCredentials([file(credentialsId: 'qrcool-frontend-staging-env', variable: 'ENV_FILE')]) {
                        script {
                            def secretContent = readFile(env.ENV_FILE)
                            writeFile file: '.env.staging', text: secretContent
                        }
                    }
                    withCredentials([file(credentialsId: 'qrcool-frontend-production-env', variable: 'ENV_FILE')]) {
                        script {
                            def secretContent = readFile(env.ENV_FILE)
                            writeFile file: '.env.production', text: secretContent
                        }
                    }
                }
            }
        }

        stage("Install Dependencies Backend") {
            when { expression backendChanges() }
            steps {
                dir('backend') {
                    sh "npm install"
                    
                    withCredentials([file(credentialsId: 'qrcool-backend-development-env', variable: 'ENV_FILE')]) {
                        script {
                            def secretContent = readFile(env.ENV_FILE)
                            writeFile file: '.env.development', text: secretContent
                        }
                    }
                    withCredentials([file(credentialsId: 'qrcool-backend-production-env', variable: 'ENV_FILE')]) {
                        script {
                            def secretContent = readFile(env.ENV_FILE)
                            writeFile file: '.env.production', text: secretContent
                        }
                    }
                }
            }
        }

        stage ("Build Frontend") {
            when { expression frontendChanges() }
            steps {
                dir('frontend/QrCool') {
                    sh "npm run build:prod"
                }
            }
        }

        stage("Build Backend") {
            when { expression backendChanges() }
            steps {
                dir('backend') {
                    sh 'npm run build:image'
                }
            }
        }

        stage("Test") {
            when { expression backendChanges() }
            steps {
                dir('backend') {
                    sh 'docker run --rm -i --entrypoint sh qrcoolimage -c "sh ./testEntrypoint.sh"'   
                }
            }
        }

        stage("Deploy Frontend") {
            when { expression frontendChanges() }
            steps {
                dir('frontend/QrCool') {
                    sh 'scp -r dist/* clark@clarkmiller.ca:/var/www/qrcool.ca/html'
                }
            }
        }

        stage("Deploy Backend") {
            when { expression backendChanges() }
            steps {
                dir('backend') {
                    sh 'npm run save:image'
                    sh 'scp qrcoolimage.tar miller@sys1.clarkmiller.ca:/home/miller'
                    sh 'ssh sys1.clarkmiller.ca "docker load -i qrcoolimage.tar"'
                    sh 'ssh sys1.clarkmiller.ca "docker compose stop qrcool ; docker compose rm -f qrcool; docker compose up -d qrcool"'
                }
            }
        }
    }
}