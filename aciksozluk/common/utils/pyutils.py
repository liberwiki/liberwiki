import re


def noop(*a, **kw):
    pass


def with_attrs(**kwargs):
    """
    Creates a decorator that adds the given attributes to the decorated function.
    """

    def decorator(func):
        for key, value in kwargs.items():
            setattr(func, key, value)
        return func

    return decorator


def returns(value):
    """
    Creates a lambda function that returns the given value.
    """

    def wrapper(*a, **kw):
        return value

    return wrapper


def camel_to_snake(name):
    """
    Convert PascalCase and camelCase to snake_case.
    """
    name = re.sub("(.)([A-Z][a-z]+)", r"\1_\2", name)
    return re.sub("([a-z0-9])([A-Z])", r"\1_\2", name).lower()


def snake_to_human(name):
    """
    Convert snake_case to Human Readable.
    """
    return name.replace("_", " ").title()


def first_of(iterable, default=None, pred=None):
    """
    Returns the first true value in the iterable.

    If no true value is found, returns *default*

    If *pred* is not None, returns the first item
    for which pred(item) is true.

    """
    # first_true([a,b,c], x) --> a or b or c or x
    # first_true([a,b], x, f) --> a if f(a) else b if f(b) else x
    return next(filter(pred, iterable), default)
