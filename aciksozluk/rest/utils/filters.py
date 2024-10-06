def make_filters(field, filter_cls, lookup_expressions):
    get_key = lambda expr: f"{field}__{expr}" if expr != "exact" else field
    return {get_key(expr): filter_cls(field_name=field, lookup_expr=expr) for expr in lookup_expressions}
