import os
import requests

class PinataService:
    def __init__(self):
        self.jwt = os.getenv("PINATA_JWT")
        self.api_key = os.getenv("PINATA_API_KEY")
        self.secret = os.getenv("PINATA_SECRET_API_KEY")

    # 🔹 Upload file to IPFS
    def upload(self, file):
        url = "https://api.pinata.cloud/pinning/pinFileToIPFS"

        files = {
            'file': (
                getattr(file, "filename", "record.txt"),
                getattr(file, "stream", file)
            )
        }

        # Prefer JWT
        if self.jwt:
            headers = {
                "Authorization": f"Bearer {self.jwt}"
            }
        else:
            headers = {
                "pinata_api_key": self.api_key,
                "pinata_secret_api_key": self.secret
            }

        response = requests.post(url, files=files, headers=headers)

        if response.status_code != 200:
            raise Exception(f"Pinata upload failed: {response.text}")

        return response.json()['IpfsHash']

    # 🔹 Fetch file from IPFS
    def fetch(self, cid):
        url = f"https://gateway.pinata.cloud/ipfs/{cid}"

        response = requests.get(url)

        if response.status_code != 200:
            raise Exception("Failed to fetch from IPFS")

        return response.text