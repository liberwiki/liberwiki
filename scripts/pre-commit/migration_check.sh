#!/usr/bin/env bash

exec python aciksozluk/manage.py makemigrations --check --dry-run
