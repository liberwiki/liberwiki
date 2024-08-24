def make_filters(field, filter_cls, lookup_expressions):
    return {f"{field}__{expr}": filter_cls(field_name=field, lookup_expr=expr) for expr in lookup_expressions}
