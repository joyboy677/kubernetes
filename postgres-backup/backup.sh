#!/usr/bin/env bash
set -e

# 1. Authenticate to GCP using the mounted secret key
gcloud auth activate-service-account --key-file=/secret/key.json

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILENAME="todo-db-backup-${TIMESTAMP}.sql"

echo "Starting database dump..."
pg_dump -v "$DATABASE_URL" > "/tmp/${BACKUP_FILENAME}"

echo "Uploading backup to Google Cloud Storage..."
gcloud storage cp "/tmp/${BACKUP_FILENAME}" "gs://${GCS_BUCKET}/${BACKUP_FILENAME}"

echo "Backup successful: ${BACKUP_FILENAME}"