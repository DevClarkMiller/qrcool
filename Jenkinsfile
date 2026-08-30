@Library('pipeline-lib') _

pipeline {
    agent any

    parameters {
        booleanParam(
            name: 'All',
            defaultValue: false,
            description: 'Runs all even if there are no changes'
        )
    }

    environment {
        NODE_ENV = 'production'
        USERNAME = credentials('vps-username')
        DOMAIN = credentials('vps-domain')
        JENKINS = 'Jenkinsfile'
        CLIENT_DIR = 'frontend'
        API_DIR = 'backend'
    }

    stages {
        stage('Determine Changes and run pipelines') {
            steps {
                checkout scm

                script {
                    def services = [
                        'qrcool.client': CLIENT_DIR,
                        'qrcool.api': API_DIR,
                    ]

                    def toTrigger = []
                    services.each { service, path ->
                        if (params.All || checkMicroservice(path)) {
                            echo "Changes detected in ${service}, will trigger pipelines."
                            toTrigger << service // Add to the list
                        } else {
                            echo "No changes in ${service}, skipping."
                        }
                    }

                    if (toTrigger.isEmpty()) {
                        echo "No services changed. Nothing to trigger."
                    }
					
                    toTrigger.each { service -> 
                        echo "Triggering ${service}..."
                        build job: service,
                                parameters: [
                                    booleanParam(name: 'All', value: params.All)
                                ],
                                wait: true // set false for async
                        echo "${service} finished."
                    }
                }
            }
        }
    }
}
