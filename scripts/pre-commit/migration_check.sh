#!/usr/bin/env bash

exec python liberwiki/manage.py makemigrations --check --dry-run
