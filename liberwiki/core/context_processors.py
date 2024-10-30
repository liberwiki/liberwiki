from liberwiki.config import CONFIG


def config_processor(request):
    context = dict(
        config=dict(
            NAME=CONFIG.NAME,
            DEBUG=CONFIG.DEBUG,
            HOSTS=CONFIG.HOSTS,
            LANGUAGE=CONFIG.LANGUAGE,
        )
    )
    return context
