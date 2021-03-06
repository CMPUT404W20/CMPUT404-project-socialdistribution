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
    # https://github.com/azu/parse-github-event/blob/master/src/parse-github-event.ts for reference

    parsed_events = []
    for event in raw_data:
        message = ""
        if event["type"] == "ForkEvent":
            message = "{} forked {} from {}".format(
                event["actor"]["display_login"],
                event["payload"]["forkee"]["full_name"],
                event["repo"]["name"]
            )
        elif event["type"] == "WatchEvent":
            message = "{} starred {}".format(
                event["actor"]["display_login"],
                event["repo"]["name"]
            )
        elif event["type"] == "PullRequestEvent":
            message = "{} {} pull request #{} at {}".format(
                event["actor"]["display_login"],
                event["payload"]["action"],
                event["payload"]["number"],
                event["repo"]["name"]
            )
        elif event["type"] == "PushEvent":
            message = "{} pushed to branch {} at {}".format(
                event["actor"]["display_login"],
                event["payload"]["ref"].split("/")[-1],
                event["repo"]["name"]
            )
        elif event["type"] == "DeleteEvent":
            message = "{} deleted {} {} at {}".format(
                event["actor"]["display_login"],
                event["payload"]["ref_type"],
                event["payload"]["ref"],
                event["repo"]["name"]
            )
        elif event["type"] == "CreateEvent":
            if event["payload"]["ref_type"] == "respository":
                message = "{} created repository {}".format(
                    event["actor"]["display_login"],
                    event["repo"]["name"]
                )
            else: 
                message = "{} created {} at {}".format(
                    event["actor"]["display_login"],
                    event["payload"]["ref_type"],
                    event["repo"]["name"]
                )
        
        if (len(message) > 0):
            parsed_event = {
                "content": message,
                "title": "Github",
                "visibility": "PRIVATE",
                "published": event["created_at"].replace("Z", ".000000Z"),
                "comments": [],
                "isGithubPost": True, # used to tell React to render this post differently compared to other Posts
            }

            parsed_events.append(parsed_event)
        # TODO: need to add more event types but we can come back to that later

    return parsed_events

def load_github_events(github_url, access_token):
    try:
        raw_data = get_raw_data(github_url, access_token)
        parsed_events = parse_data(raw_data)
        return parsed_events
    except:
        return []
    

