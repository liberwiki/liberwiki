#!/usr/bin/env bash

cd liberwiki-frontend || exit 1

hash1=$(find ./src/locales/* -type f -print0 | sort -z | xargs -0 sha1sum | sha1sum)
npm run collect-i18n
hash2=$(find ./src/locales/* -type f -print0 | sort -z | xargs -0 sha1sum | sha1sum)

if [ "$hash2" != "$hash1" ]; then
	echo "Error: You have translations that are not up-to-date. Please run 'npm run collect-i18n' and commit the changes."
	exit 1
fi


cd ../liberwiki || exit 1

hash3=$(find ./locale/* -type f -print0 | sort -z | xargs -0 sha1sum | sha1sum)
python manage.py makemessages --all
hash4=$(find ./locale/* -type f -print0 | sort -z | xargs -0 sha1sum | sha1sum)

if [ "$hash3" != "$hash4" ]; then
	echo "Error: You have translations that are not up-to-date. Please run 'python manage.py makemessages --all' and commit the changes."
	exit 1
fi
