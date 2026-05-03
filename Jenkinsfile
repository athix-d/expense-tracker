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
                dir('frontend') {
                    docker_build("expense-tracker-frontend", "${env.BUILD_NUMBER}")
                }
            }
        }
        stage('Deploy Frontend') {
            steps {
                echo "Deploying frontend using docker compose"
                dir('frontend') {
                    sh """
                    echo "===== DEBUG START ====="
                    echo "pwd"
                    echo "ls -la"
                    echo "===== DOCKER COMPOSE CONFIG ====="
                    docker compose config
                    echo "===== DOCKER COMPOSE DOWN ====="
                    docekr compose down
                    echo "===== RUNNING COMPOSE ====="
                    docker compose up -d
                    echo "===== CONTAINERS ====="
                    docker ps -a
                    echo "===== DEBUG END ====="
                    """
                }
            }
        }
        stage('Add Backend IP to known hosts with normal user') {
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
                        if [ ! -d expense-tracker ]; then
                            git clone https://github.com/athix-d/expense-tracker.git
                        fi &&
                        cd expense-tracker/backend &&
                        mkdir -p volume/store_data &&
                        git pull &&
                        docker build -t expense-tracker-backend:${BUILD_NUMBER} . &&
                        docker compose down &&
                        docker compose up -d
                    '
                    """
                }
            }
        }
    }
}