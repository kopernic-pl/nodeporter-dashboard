#!/bin/bash
# Build the Next.js project and create a Docker image.
# Usage: ./ops/build_and_dockerize.sh [image-tag]

set -e

IMAGE_NAME="nodeporter"
TAG="${1:-latest}"

# Go to project root
dirname=$(dirname "$0")
cd "$dirname/.."

# Build the Docker image (build and install happen inside Docker)
docker build -t "$IMAGE_NAME:$TAG" .

echo "Docker image built: $IMAGE_NAME:$TAG"
