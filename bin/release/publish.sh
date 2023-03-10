#!/bin/bash

set -e

VERSION=$1
MINOR=${VERSION%.*}
MAJOR=${MINOR%.*}

jwt=$(cat .dockerhub.jwt)
readme=$(cat .dockerhub.readme)

for image in "pustovitdmytro/ianus-base" "pustovitdmytro/ianus-admin" "pustovitdmytro/ianus-worker"; do 
    for tag in $VERSION $MINOR $MAJOR "latest"; do 
        docker tag $image:$VERSION $image:$tag
        docker push $image:$tag
        echo "Pushed $image:$tag"
        curl -X PATCH --fail -H "Content-type: application/json" -H "Authorization: JWT $jwt" -d "$readme" "https://hub.docker.com/v2/repositories/$image"
    done; 
done
