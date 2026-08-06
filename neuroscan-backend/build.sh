#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Downloading models from GitHub Releases..."
python download_models.py

echo "Build complete."
