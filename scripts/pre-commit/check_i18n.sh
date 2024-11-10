#!/usr/bin/env bash

cd liberwiki-frontend || exit 1

npm run collect-i18n -- --fail-on-update

cd ../liberwiki || exit 1

hash1=$(find ./locale/**/*.po -type f -print0 | sort -z | xargs -0 sha1sum | sha1sum)
python manage.py makemessages --all --no-obsolete --no-location
hash2=$(find ./locale/**/*.po -type f -print0 | sort -z | xargs -0 sha1sum | sha1sum)

if [ "$hash1" != "$hash2" ]; then
	echo "Error: You have translations that are not up-to-date. Please run 'python manage.py makemessages --all --no-obsolete --no-location' and commit the changes."
	exit 1
fi
