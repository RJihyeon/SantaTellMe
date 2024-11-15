def build_query_param(query_params: dict) -> str:
    query_string = ""
    for key, value in query_params.items():
        query_string += f"{key}={value}&"
    if query_string[-1] == "&":
        query_string = query_string[:-1]

    return query_string
