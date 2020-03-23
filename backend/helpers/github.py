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

def prase_data(raw_data):
    parsed_data = {}
    parsed_list = []
    for item in raw_data:
        if item['type'] == 'ForkEvent':
            parsed_data["name"] = item['actor']['display_login']
            parsed_data["event"] = item['type']
            parsed_data["Forked_Repo"] = item['payload']['forkee']['full_name']
            parsed_data["repo"] = item['repo']['name']

        else:
            parsed_data["name"] = item['actor']['display_login']
            parsed_data["event"] = item['type']
            parsed_data["repo"] = item['repo']['name']
            parsed_data.pop("Forked_Repo", None)

        parsed_list.append(parsed_data.copy())
    return parsed_list

def load_github_events(github_url, access_token):
    raw_data = get_raw_data(github_url, access_token)
    parsed_data = prase_data(raw_data)

    return parsed_data

