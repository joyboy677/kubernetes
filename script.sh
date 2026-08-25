#!/usr/bin/env bash
set -e

# Usage check
if [ -z "$1" ]; then
  echo "Error: Please provide a version tag (e.g., ./script.sh 1.2)"
  exit 1
fi

TAG=$1
COMMIT_MSG=${2:-"Release $TAG"}

echo "--> Staging files..."
git add .

echo "--> Committing changes..."
git commit -m "$COMMIT_MSG" || echo "No changes to commit."

echo "--> Creating tag: $TAG..."
git tag -a "$TAG" -m "$COMMIT_MSG"

echo "--> Pushing code and tags to GitHub..."
git push origin main
git push origin "$TAG"

echo "--> Done! Release tag $TAG created and pushed."