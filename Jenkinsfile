@Library("jenkins-shared-library") _
pipeline {
    agent any

    stages {
        stage('Code Checkout') {
            steps {
                 git_clone("https://github.com/athix-d/expense-tracker.git", "main")
            }
        }
        stage('Build Docker Image for Frontend') {
            steps {
                echo "changing directory to expense-tracker/frontend"
                dir('expense-tracker/frontend') {
                    docker_build("expense-tracker-frontend", "${env.BUILD_NUMBER}")
                }
            }
        }
        stage('Deploy Frontend') {
            steps {
                echo "Deploying frontend using docker compose"
                dir('expense-tracker/frontend') {
                    sh "docker compose up -d"
                }
            }
        }
        stage('Add Backend IP to known hosts') {
            steps {
                withCredentials([string(credentialsId: 'backend_ip_address', variable: 'BACKEND_IP')]) {
                 known_hosts(BACKEND_IP)   
                }
            }
        }
        stage('Deploy Backend') {
            steps {
                withCredentials([string(credentialsId: 'backend_ip_address', variable: 'BACKEND_IP'), string(credentialsId: 'instance_username', variable: 'SSH_USER')]) {
                    sh """
                    ssh ${SSH_USER}@${BACKEND_IP} '
                    cd expense-tracker || git clone https://github.com/athix-d/expense-tracker.git &&
                    cd expense-tracker/backend &&
                    git pull
                    docker build -t expense-tracker-backend:${BUILD_NUMBER} . &&
                    docker compose up -d
                    '
                    """
                }
            }
        }
    }
}