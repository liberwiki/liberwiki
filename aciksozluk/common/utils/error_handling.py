from contextlib import suppress

import sentry_sdk


class SuppressAndRun(suppress):  # NOQA
    """
    Context manager that suppresses the given exceptions and runs the given function.
    """

    def __init__(self, *exceptions, func=print):  # NOQA
        self._exceptions = exceptions
        self.func = func

    def __exit__(self, exc_type, exc_val, exc_tb):
        suppressed = super().__exit__(exc_type, exc_val, exc_tb)
        if suppressed:
            self.func(exc_val)
        return suppressed


class SuppressToSentry(SuppressAndRun):
    """
    Context manager that suppresses the given exceptions and sends them to Sentry.
    """

    def __init__(self, *exceptions, func=sentry_sdk.capture_exception):  # NOQA
        self._exceptions = exceptions
        self.func = func


def suppress_callable(*exceptions, func=print):
    """
    Same as SuppressAndRun but as a decorator instead of a context manager.
    """

    def decorator(f):
        def wrapper(*a, **kw):
            with SuppressAndRun(*exceptions, func=func):
                return f(*a, **kw)

        return wrapper

    return decorator


def suppress_callable_to_sentry(*exceptions):
    """
    Same as SuppressToSentry but as a decorator instead of a context manager.
    """
    return suppress_callable(exceptions, func=sentry_sdk.capture_exception)
