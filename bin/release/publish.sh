#!/bin/bash

VERSION=$1
MINOR=${VERSION%.*}
MAJOR=${MINOR%.*}

for image in "pustovitdmytro/ianus-base" "pustovitdmytro/ianus-admin" "pustovitdmytro/ianus-worker"; do 
    for tag in $VERSION $MINOR $MAJOR "latest"; do 
        docker tag $image:$VERSION $image:$tag
        docker push $image:$tag
        echo "Pushed $image:$tag"
    done; 
done
