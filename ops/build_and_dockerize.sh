#!/bin/bash
# Build the Next.js project and create a Docker image.
# Usage: ./ops/build_and_dockerize.sh [image-tag]

set -e

OWNER="${GITHUB_REPOSITORY_OWNER:-kopernic-pl}"
IMAGE_NAME="ghcr.io/${OWNER}/nodeporter-dashboard"
TAG="${1:-latest}"

# Go to project root
dirname=$(dirname "$0")
cd "$dirname/.."

# Build the Docker image (build and install happen inside Docker)
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
VCS_REF=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

docker build \
  --build-arg VERSION="$TAG" \
  --build-arg VCS_REF="$VCS_REF" \
  --build-arg BUILD_DATE="$BUILD_DATE" \
  -t "$IMAGE_NAME:$TAG" \
  -f ./ops/Dockerfile .
docker tag "$IMAGE_NAME:$TAG" "$IMAGE_NAME:latest"

echo "Docker image built: $IMAGE_NAME:$TAG and $IMAGE_NAME:latest"
