#!/bin/sh

set -e
npm run build
exec npm run start
