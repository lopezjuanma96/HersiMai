import requests
import json

url = "https://hersimai.azurewebsites.net/api/list_user/"
url = "http://localhost:8080/api/report?code=8072"

r = requests.get(url)

try:
    print(r.json())
except json.JSONDecodeError:
    print("No JSON object could be decoded")
    print(r.text)
