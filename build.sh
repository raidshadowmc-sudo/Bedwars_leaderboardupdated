#!/usr/bin/env bash
# exit on error
set -o errexit

pip install --upgrade pip
pip install -r render_requirements.txt

# Initialize database
python init_db.py