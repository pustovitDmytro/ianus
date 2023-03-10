#!/bin/bash

set -e

docker login -u $DOCKER_REGISTRY_USER -p $DOCKER_REGISTRY_PASSWORD

AUTH_BODY='{"username":"'"$DOCKER_REGISTRY_USER"'","password":"'"$DOCKER_REGISTRY_PASSWORD"'"}'

response=$(curl -XPOST --fail -H "Content-type: application/json" -d $AUTH_BODY 'https://hub.docker.com/v2/users/login')

echo $response | jq -r .token >> .dockerhub.jwt