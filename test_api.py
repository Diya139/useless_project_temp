import requests
import json

with open("sadya.jpg", "rb") as image:

    response = requests.post(
        "http://127.0.0.1:5000/audit",
        files={"image": image}
    )

print(json.dumps(response.json(), indent=4))