from django.template import RequestContext
from django.template.loader import render_to_string
from mjml import mjml2html


def mjml(mjml_string):
    mjml_html = mjml2html(
        mjml_string,
        disable_comments=True,
        social_icon_origin="https://example.com",
        fonts={
            "Tinos": "https://fonts.googleapis.com/css2?family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap",
        },
    )
    return mjml_html


def mjml_template(template, context, request=None):
    return mjml(render_to_string(template, context, RequestContext(request, context, use_l10n=True, use_tz=True)))
