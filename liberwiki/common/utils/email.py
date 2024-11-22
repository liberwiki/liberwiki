from django.template.loader import render_to_string
from mjml import mjml2html

from liberwiki.config import CONFIG


def get_global_email_context(request):
    global_email_context = {
        "site_name": CONFIG.NAME,
        "site_url": CONFIG.HOSTS.DOMAIN,
    }
    return global_email_context


def mjml(mjml_string):
    mjml_html = mjml2html(
        mjml_string,
        disable_comments=True,
        fonts={
            "Tinos": "https://fonts.googleapis.com/css2?family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap",
        },
    )
    return mjml_html


def mjml_template(template, context, request=None):
    return mjml(render_to_string(template, context | get_global_email_context(request), request))


def text_template(template, context, request=None):
    return render_to_string(template, context | get_global_email_context(request), request)
