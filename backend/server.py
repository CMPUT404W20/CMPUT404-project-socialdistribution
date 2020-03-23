from backend.models import *
from backend.utils import *

import requests
from requests.auth import HTTPBasicAuth, HTTPDigestAuth


def get_from_host(endpoint, host):
    print(host.url+endpoint)
    print(host.serviceAccountPassword)
    print(host.serviceAccountUsername)
    response = requests.get(
        host.url+endpoint,
        auth=(host.serviceAccountUsername,
              host.serviceAccountPassword)
    )

    return response

def is_server_user(user_full_id):

    pass


# def get_host_data(request_endpoint):
#     response_data =
#     for host in Host.objects.all():
#         if host.serviceAccountUsername and host.serviceAccountPassword:
#             response = requests.get(
#                 host.url+request_endpoint,
#                 auth=(host.serviceAccountUsername,
#                         host.serviceAccountPassword)
#             )

#             if response.status_code == 200:
#                 response_data = response.json()

#     return response_data

#                 # # if they followe swagger format, then use "data" as key
#                 # if "data" in response_data:
#                 #     author_data = response_data["data"]
#                 # else:
#                 #     author_data += author_data
#     return
