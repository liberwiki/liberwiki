from dotenv import load_dotenv
from iubeo import boolean, comma_separated_list, config

load_dotenv()

CONFIG = config(
    {
        "DEBUG": boolean,
        "DB": {
            "NAME": str,
            "USER": str,
            "PASSWORD": str,
            "HOST": str,
            "PORT": str,
        },
        "SECRET_KEY": str,
        "ALLOWED_HOSTS": comma_separated_list,
        "AUTH": {
            "VERIFY_EMAIL_URL_TEMPLATE": str,
        },
        "HOSTS": {
            "DOMAIN": str,
            "API_SUBDOMAIN": str,
            "ADMIN_SUBDOMAIN": str,
        },
        "SETUP": {
            "SUPERUSER": {
                "USERNAME": str,
                "EMAIL": str,
                "PASSWORD": str,
            },
        },
        "LANGUAGE": str,
        "EMAIL": {
            "SMTP": {
                "HOST": str,
                "PORT": int,
                "USER": str,
                "PASSWORD": str,
            },
            "DEFAULT_VERIFICATION_FROM_EMAIL": str,
        },
        "DEVTOOLS": {
            "SENTRY": {
                "DSN": str,
                "TRACES_SAMPLE_RATE": str,
            },
        },
    },
    prefix="LIBERWIKI",
    sep="__",
)
