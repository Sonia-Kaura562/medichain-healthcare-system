from dotenv import load_dotenv
from cryptography.fernet import Fernet

import os

# =====================================
# WALLET ENCRYPTION KEY
# =====================================
WALLET_SECRET_KEY = (
    b'u7z9iysFzvrdV9sckK38k1x7S14r6kEJnldeaF0gsrQ='
)

cipher = Fernet(
    WALLET_SECRET_KEY
)

load_dotenv()

SECRET_KEY = os.getenv(
    "SECRET_KEY"
)

EMAIL_ADDRESS = os.getenv(
    "EMAIL_ADDRESS"
)

EMAIL_PASSWORD = os.getenv(
    "EMAIL_PASSWORD"
)