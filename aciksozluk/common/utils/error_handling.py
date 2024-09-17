from contextlib import ContextDecorator, suppress

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


class TransformExceptions(ContextDecorator):
    """
    Context manager that transforms the given exceptions into another exception.
    Takes a list of exception types to transform, a new exception type to transform them into, and an optional
    transformation function.
    The transformation function gets the previous exception as an argument and should return the new exception.
    """

    def __init__(self, *exception_types, transform=None, keep_original=True):
        self.exception_types = exception_types
        self.transform = transform
        self.keep_original = keep_original

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if isinstance(exc_val, self.exception_types):
            new_exception = self.transform(exc_val) if self.transform else exc_val
            raise new_exception from (self.keep_original and exc_val or None)
        return False
