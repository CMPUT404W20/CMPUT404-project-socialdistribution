import requests
from urllib.parse import urlparse

def get_username(github_url):
    parsed_url = urlparse(github_url)
    id = parsed_url.path.replace("/","")
    
    return id

def get_raw_data(github_url, access_token):
    github_token = 'token  ' + access_token

    if github_url == "":
        return []

    id = get_username(github_url)
    request_url = 'https://api.github.com/users/{}/received_events'.format(id)
    headers = {
        'Authorization': github_token,
    }
    response = requests.get(request_url,headers=headers)
    data = response.json()

    return data

def parse_data(raw_data):
    parsed_data = []
    for item in raw_data:
        print("\n", item["type"])
        message = ""
        if item["type"] == "ForkEvent":
            message = "{} forked {} from {}".format(
                item["actor"]["display_login"],
                item["payload"]["forkee"]["full_name"],
                item["repo"]["name"]
            )
        elif item["type"] == "WatchEvent":
            message = "{} starred {}".format(
                item["actor"]["display_login"],
                item["repo"]["name"]
            )
        
        print(message)

    return parsed_data

def load_github_events(github_url, access_token):
    raw_data = get_raw_data(github_url, access_token)
    parsed_data = parse_data(raw_data)

    return parsed_data

