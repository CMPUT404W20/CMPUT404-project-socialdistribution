from urllib.parse import urlparse


def protocol_removed(url):
    parsed_url = urlparse(url)
    scheme = "%s://" % parsed_url.scheme
    url = parsed_url.geturl().replace(scheme, '', 1)

    return url


def get_url_path(url):
    parsed_url = urlparse(url)

    return parsed_url.path[1:]


def get_host_from_id(id):
    parsed_uri = urlparse(id)
    host = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)

    return host
