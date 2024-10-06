from rest_framework import pagination
from rest_framework.response import Response


class PageNumberPagination(pagination.PageNumberPagination):
    page_size_query_param = "page_size"

    def get_paginated_response(self, data):
        return Response(
            {"count": self.page.paginator.count, "total_pages": self.page.paginator.num_pages, "results": data}
        )

    def get_paginated_response_schema(self, schema):
        return {
            "type": "object",
            "properties": {
                "count": {
                    "type": "integer",
                    "description": "Total number of items available.",
                    "example": 1102,
                },
                "page_size": {
                    "type": "integer",
                    "description": "Number of results to return per page.",
                    "example": 100,
                },
                "total_pages": {
                    "type": "integer",
                    "description": "Total number of pages.",
                    "example": 17,
                },
                "results": schema,
            },
        }
