import os
import base64
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

KEY = os.getenv("AES_KEY").encode()  # 16, 24, or 32 bytes


def encrypt_data(data: str) -> str:
    cipher = AES.new(KEY, AES.MODE_EAX)

    ciphertext, tag = cipher.encrypt_and_digest(data.encode())

    encrypted = cipher.nonce + tag + ciphertext

    return base64.b64encode(encrypted).decode()


def decrypt_data(enc_data: str) -> str:
    raw = base64.b64decode(enc_data)

    nonce = raw[:16]
    tag = raw[16:32]
    ciphertext = raw[32:]

    cipher = AES.new(KEY, AES.MODE_EAX, nonce=nonce)

    decrypted = cipher.decrypt_and_verify(ciphertext, tag)

    return decrypted.decode()