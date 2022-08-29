pipeline {
  agent any
  options {
      // Keep the 10 most recent builds
      buildDiscarder(logRotator(numToKeepStr:'10'))
  }
  tools {
      maven 'Maven_3.8.6'
      jdk 'Jdk_11'
  }
  stages {
    stage ('Initialize') {
        steps {
            //echo "${GIT_BRANCH}"
            echo "${env.GIT_BRANCH}"
        }
    }

    stage ('Stop Containers') {
        steps {
            bat 'docker compose down'
        }
    }

    stage ('Test') {
        steps {
            bat 'mvn -Dmaven.test.failure.ignore=true test'
        }
        post {
            success {
                junit 'target/surefire-reports/**/*.xml'
            }
        }
    }

    stage ('Build') {
        steps {
            bat 'mvn -Dskip.tests=true package'
        }
    }

    stage ('Start Containers') {
        steps {
            bat 'docker compose up -d --build'
        }
    }

    stage('Finalize') {
      steps {
        bat 'echo "Finalizing"'
      }
      post{
        always {
         mail bcc: '', body: 'Pipeline has been succesfully executed ', cc: '', from: 'nurullah.bayram@capgemini.com', replyTo: 'nurullah.bayram@capgemini.com', subject: 'Pipeline has been succesfully executed ', to: 'nurullah.bayram@capgemini.com'
        }
      }
    }

  }
}