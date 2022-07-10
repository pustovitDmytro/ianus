#!/bin/bash

VERSION=$1

IMAGE_ID=$(docker images --filter=reference=pustovitdmytro/ianus-base --format "{{.ID}}")
docker tag $IMAGE_ID pustovitdmytro/ianus-base:$VERSION