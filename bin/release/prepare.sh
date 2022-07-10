#!/bin/bash

VERSION=$1

docker build -t pustovitdmytro/ianus-base:$VERSION -f docker/Base.dockerfile .
docker build -t pustovitdmytro/ianus-worker:$VERSION -f docker/Worker.dockerfile .
docker build -t pustovitdmytro/ianus-admin:$VERSION -f docker/Admin.dockerfile .
