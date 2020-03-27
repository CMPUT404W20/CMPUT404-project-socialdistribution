from backend.models import *
from backend.utils import *

from django.conf import settings

import requests
import json


def get_from_host(endpoint, host):
    print(endpoint)
    response = requests.get(
        endpoint,
        auth=(host.serviceAccountUsername,
              host.serviceAccountPassword)
    )

    return response


def post_to_host(endpoint, host, body):
    headers = {"Content-type": "application/json"}
    response = requests.post(host.url+endpoint,
                             data=json.dumps(body),
                             auth=(host.serviceAccountUsername, host.serviceAccountPassword),
                             headers=headers)
    return response


def is_server_user(user_full_id):
    if get_host_from_id(user_full_id) != settings.APP_HOST:
        return False
    return True
