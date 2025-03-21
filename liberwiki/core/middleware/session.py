from django.conf import settings
from django.contrib.sessions.middleware import SessionMiddleware
from django.core.exceptions import SuspiciousOperation


class CookieORHeaderSessionMiddleware(SessionMiddleware):
    def process_request(self, request):
        session_key = self.get_session_key(request)
        request.session = self.SessionStore(session_key)

    @staticmethod
    def get_session_key(request):
        cookie_session_key = request.COOKIES.get(settings.SESSION_COOKIE_NAME)
        header_session_key = request.headers.get(settings.SESSION_HEADER_NAME)
        if cookie_session_key and header_session_key:
            if cookie_session_key != header_session_key:
                raise SuspiciousOperation("Session key mismatch")
        return cookie_session_key or header_session_key
