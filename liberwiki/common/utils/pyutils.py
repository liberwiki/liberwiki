import re
from functools import wraps
from itertools import combinations


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


def raises(exception):
    """
    Creates a lambda function that raises the given exception.
    """

    def wrapper(*a, **kw):
        raise exception

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


def not_none(value):
    return value is not None


def cloned(f):
    """
    A decorator that returns a new function that calls the decorated function.
    Some decorators edit the decorated function instead of returning new functions
    But sometimes we want a new function, especially when using decorators functionally

    Example:
        foo = side_effect_decorator(original, side_effect1)
        bar = side_effect_decorator(original, side_effect2)

    Here the side effect is applied to original directly.
    But we want a new function so that the original is not modified.

    foo = side_effect_decorator(noop_function_cloner(original), side_effect1)
    """

    @wraps(f)
    def wrapper(*a, **kw):
        return f(*a, **kw)

    return wrapper


class Sentinel:
    """Creates a sentinel object that ever only equals to itself"""

    def __init__(self, name):
        """
        Name is the sentinel is preferably in the constant name convention like `SENTINEL_NAME`
        """
        self.name = name

    def __repr__(self):
        return f"<Sentinel:{self.name}>"

    def __str__(self):
        return "<Sentinel:{self.name}>"

    def __bool__(self):
        return False

    def __eq__(self, other):
        return self is other


def purge_iterable(iterable, items):
    """
    Remove items from an iterable
    """
    return [item for item in iterable if item not in items]


def purge_mapping(mapping, keys):
    """
    Remove keys from a mapping
    """
    return {key: value for key, value in mapping.items() if key not in keys}


def all_combinations(options):
    """
    Returns all possible combinations of the given options
    """
    return [list(comb) for r in range(1, len(options) + 1) for comb in combinations(options, r)]
