from eth_account import Account
import time
import random
import uuid
import bcrypt
import jwt
from datetime import datetime, timedelta
from db import users_collection
from db import sessions_collection
from services.email_service import send_otp_email
from config import SECRET_KEY
from config import cipher
from datetime import datetime
import uuid
attempt_store = {}

otp_store = {}

blacklisted_tokens = set()

login_attempts = {}

# =========================================
# SEND OTP
# =========================================
def send_otp(identifier, email=None, role="patient", full_name=None, country=None):

    if not country:

        return {

            "success": False,

            "message":
            "Country is required"
        }

    current_time = time.time()

    # =====================================
    # CHECK EXISTING OTP
    # =====================================
    existing = otp_store.get(identifier)

    if existing:

        # =================================
        # RESEND SAME OTP WITHIN 60 SECONDS
        # =================================
        if current_time - existing["created_at"] < 60:

            existing["country"] = country
            otp = existing["otp"]

            # Send same OTP again
            if email:

                email_sent = send_otp_email(

                    email,

                    otp
                )

                if not email_sent:

                    return {

                        "success": False,

                        "message":
                        "Failed to send OTP email"
                    }

            return otp

    # =====================================
    # GENERATE NEW OTP
    # =====================================
    otp = str(random.randint(100000, 999999))

    # =====================================
    # STORE OTP + ROLE
    # =====================================
    otp_store[identifier] = {

        "otp": otp,

        "role": role,

        "country": country,

        "created_at": current_time,

        "expires": current_time + 60,

        "fullName": full_name,

        "purpose": "register"
    }

    # =====================================
    # SEND EMAIL OTP
    # =====================================
    if email:

        email_sent = send_otp_email(

            email,

            otp
        )

        if not email_sent:

            return {

                "success": False,

                "message": "Failed to send OTP email"
            }

    return otp

# =========================================
# VERIFY OTP + CREATE USER
# =========================================
def verify_otp(data):

    contact = data.get("contact")

    email = data.get("email")

    otp = data.get("otp")

    identifier = contact if contact else email

    # =====================================
    # CHECK OTP EXISTS
    # =====================================
    stored_otp = otp_store.get(

        identifier
    )

    if not stored_otp:

        return "OTP_NOT_FOUND", None

    # =====================================
    # CHECK OTP EXPIRY
    # =====================================
    if time.time() > stored_otp["expires"]:

        del otp_store[identifier]

        attempt_store.pop(
            identifier,
            None
        )

        return "OTP_EXPIRED", None

    # =====================================
    # FAILED ATTEMPTS
    # =====================================
    attempts = attempt_store.get(

        identifier,
        0
    )

    if attempts >= 5:

        del otp_store[identifier]

        attempt_store.pop(
            identifier,
            None
        )

        return "TOO_MANY_ATTEMPTS", None

    # =====================================
    # WRONG OTP
    # =====================================
    if stored_otp["otp"] != otp:

        attempt_store[identifier] = (

            attempts + 1
        )

        return "INVALID_OTP", None

    # =====================================
    # RESET ATTEMPTS
    # =====================================
    attempt_store.pop(

        identifier,
        None
    )

    # =====================================
    # GET STORED DATA
    # =====================================
    role = stored_otp.get(

        "role",

        "patient"
    )

    full_name = stored_otp.get(

        "fullName"
    )

    # =====================================
    # CHECK EXISTING USER
    # =====================================
    query = []

    if email:

        query.append({

            "email": email
        })

    if contact:

        query.append({

            "contact": contact
        })

    existing_user = None

    if query:

        existing_user = (

            users_collection.find_one({

                "$or": query
            })
        )

        # Already exists
        if existing_user:

            del otp_store[identifier]

            return (

                existing_user["userId"],

                existing_user["role"]
            )

    # =====================================
    # GPID PREFIX
    # =====================================
    role_prefix = {

        "patient": "PAT",

        "doctor": "DOC",

        "admin": "ADM"

    }.get(role, "USR")

    country_code = stored_otp.get(

        "country"
    )

    if not country_code:

        return (

            "COUNTRY_REQUIRED",

            None
        )

    country_code = (

        country_code
        .upper()
    )

    current_year = str(

        datetime.utcnow().year
    )

    # =====================================
    # UNIQUE GPID
    # =====================================
    while True:

        unique_code = (

            uuid.uuid4()
            .hex[:6]
            .upper()
        )

        user_id = (

            f"{role_prefix}"
            f"-{country_code}"
            f"-{current_year}"
            f"-{unique_code}"
        )

        # ================================
        # COLLISION CHECK
        # ================================
        existing_user = (
            users_collection.find_one({

                "userId":
                user_id
            })
        )

        if not existing_user:

            break

    # =====================================
    # CREATE PENDING ACCOUNT
    # =====================================
    users_collection.insert_one({

        "userId": user_id,

        "fullName": full_name,

        "contact": contact,

        "email": email,

        "role": role,

        "country": country_code,

        "password": None,

        "walletAddress": None,

        "walletType": None,

        "privateKey": None,

        "accountStatus": "pending",

        "otpVerifiedAt":
            datetime.utcnow(),

        "createdAt":
            datetime.utcnow()
    })

    # =====================================
    # CLEANUP OTP
    # =====================================
    del otp_store[identifier]

    attempt_store.pop(
        identifier,
        None
    )

    # =====================================
    # SUCCESS
    # =====================================
    return user_id, role


# =========================================
# SET PIN + ACTIVATE ACCOUNT
# =========================================
def set_pin(user_data, password, wallet_address):

    # =====================================
    # USER DATA
    # =====================================
    email = user_data.get("email")
    contact = user_data.get("contact")

    # =====================================
    # FIND USER
    # =====================================
    query = []

    if email:
        query.append({
            "email": email
        })

    if contact:
        query.append({
            "contact": contact
        })

    user = users_collection.find_one({

        "$or": query
    })

    if not user:
        return None

    # =====================================
    # CHECK ACCOUNT STATUS
    # =====================================
    if user.get(
        "accountStatus"
    ) != "pending":

        return user["userId"]

    # =====================================
    # HASH PASSWORD
    # =====================================
    hashed = bcrypt.hashpw(

        password.encode("utf-8"),

        bcrypt.gensalt()
    )

    # =====================================
    # SYSTEM WALLET
    # =====================================
    wallet_type = "user"

    private_key = None

    if not wallet_address:

        account = Account.create()

        wallet_address = (
            account.address
        )

        private_key = (
            account.key.hex()
        )

        private_key = cipher.encrypt(

            private_key.encode()

        ).decode()

        wallet_type = "system"

    # =====================================
    # UPDATE EXISTING USER
    # =====================================
    users_collection.update_one(

        {
            "userId":
            user["userId"]
        },

        {
            "$set": {

                "password":
                hashed,

                "walletAddress":
                wallet_address,

                "walletType":
                wallet_type,

                "privateKey":
                private_key,

                "accountStatus":
                "active"
            }
        }
    )

    return user["userId"]
# =========================================
# LOGIN
# =========================================
def login(identifier, password):

    # =====================================
    # CHECK LOGIN ATTEMPTS
    # =====================================
    user_attempt = login_attempts.get(identifier)

    if user_attempt:

        # =================================
        # CHECK LOCK EXPIRY
        # =================================
        if user_attempt.get("locked_until"):

            if time.time() < user_attempt["locked_until"]:

                return "ACCOUNT_LOCKED"

            else:

                # AUTO UNLOCK
                login_attempts.pop(identifier, None)

    # =====================================
    # FIND USER
    # =====================================
    query = []

    # GPID
    query.append({

        "userId": identifier
    })

    # Email
    query.append({

        "email": identifier
    })

    # Phone
    query.append({

        "contact": identifier
    })

    user = users_collection.find_one({

        "$or": query
    })

    if not user:

        return None

    # =====================================
    # BLOCK PENDING ACCOUNT
    # =====================================
    if user.get(
        "accountStatus"
    ) == "pending":

        return "ACCOUNT_PENDING"

    stored_hash = user.get("password")

    if not stored_hash:

        return None

    # =====================================
    # VERIFY PASSWORD
    # =====================================
    stored_hash = bytes(

        stored_hash
    )

    valid = bcrypt.checkpw(

        password.encode("utf-8"),

        stored_hash
    )

    if not valid:

        current = login_attempts.get(identifier, {

            "attempts": 0
        })

        attempts = current["attempts"] + 1

        # =================================
        # LOCK ACCOUNT
        # =================================
        if attempts >= 5:

            login_attempts[identifier] = {

                "attempts": attempts,

                "locked_until": time.time() + 900
            }

            return "ACCOUNT_LOCKED"

        # =================================
        # STORE ATTEMPTS
        # =================================
        login_attempts[identifier] = {

            "attempts": attempts
        }

        return None

    # =====================================
    # RESET LOGIN ATTEMPTS
    # =====================================
    login_attempts.pop(identifier, None)

    # =====================================
    # GENERATE ACCESS TOKEN
    # =====================================
    access_token = str(jwt.encode({

        "userId": user["userId"],

        "role": user["role"],

        "walletAddress": user.get("walletAddress"),

        "exp": datetime.utcnow() + timedelta(minutes=15)

    }, SECRET_KEY, algorithm="HS256"))

    # =====================================
    # GENERATE REFRESH TOKEN
    # =====================================
    refresh_token = str(jwt.encode({

        "userId": user["userId"],

        "type": "refresh",

        "exp": datetime.utcnow() + timedelta(days=7)

    }, SECRET_KEY, algorithm="HS256"))

    # =====================================
    # STORE SESSION
    # =====================================
    sessions_collection.insert_one({

        "userId": user["userId"],

        "accessToken": access_token,

        "createdAt": datetime.utcnow()
    })

    return {

        "accessToken": access_token,

        "refreshToken": refresh_token,

        "user": {

            "userId": user["userId"],

            "role": user["role"]
        }
    }


# =========================================
# SEND FORGOT PASSWORD OTP
# =========================================
def send_forgot_pin_otp(

    identifier
):

    current_time = time.time()

    # =====================================
    # FIND USER
    # =====================================
    user = users_collection.find_one({

        "$or": [

            {
                "userId":

                identifier
            },

            {
                "email":

                identifier
            },

            {
                "contact":

                identifier
            }
        ]
    })

    if not user:

        return "USER_NOT_FOUND"

    email = user.get(

        "email"
    )

    if not email:

        return "EMAIL_NOT_FOUND"

    # =====================================
    # CHECK EXISTING OTP
    # =====================================
    existing = otp_store.get(

        identifier
    )

    if existing:

        if current_time < existing.get(

            "resend_after",

            0
        ):

            return "WAIT_BEFORE_RESEND"

    # =====================================
    # GENERATE OTP
    # =====================================
    otp = str(

        random.randint(

            100000,

            999999
        )
    )

    # =====================================
    # STORE OTP
    # =====================================
    otp_store[identifier] = {

        "otp":

        otp,

        "purpose":

        "forgot_pin",

        "created_at":

        current_time,

        "expires":

        current_time + 60,

        "resend_after":

        current_time + 60
    }

    # =====================================
    # SEND EMAIL
    # =====================================
    email_sent = send_otp_email(

        email,

        otp
    )

    if not email_sent:

        return "EMAIL_FAILED"

    return "OTP_SENT"

# =========================================
# VERIFY FORGOT PIN OTP
# =========================================
def verify_forgot_pin_otp(

    identifier,

    otp
):

    current_time = time.time()

    otp_key = f"otp_{identifier}"

    # =====================================
    # CHECK OTP LOCK
    # =====================================
    user_attempt = login_attempts.get(

        otp_key
    )

    if user_attempt:

        locked_until = user_attempt.get(

            "locked_until"
        )

        if locked_until:

            if current_time < locked_until:

                return "OTP_LOCKED"

            else:

                # AUTO UNLOCK
                login_attempts.pop(

                    otp_key,

                    None
                )

    # =====================================
    # FIND OTP
    # =====================================
    stored = otp_store.get(

        identifier
    )

    if not stored:

        return "OTP_NOT_FOUND"

    # =====================================
    # CHECK PURPOSE
    # =====================================
    if (

        stored.get(

            "purpose"
        )

        != "forgot_pin"
    ):

        return "INVALID_OTP"

    # =====================================
    # CHECK EXPIRY
    # =====================================
    if current_time > stored[

        "expires"
    ]:

        otp_store.pop(

            identifier,

            None
        )

        login_attempts.pop(

            otp_key,

            None
        )

        return "OTP_EXPIRED"

    # =====================================
    # WRONG OTP
    # =====================================
    if stored["otp"] != otp:

        current = login_attempts.get(

            otp_key,

            {

                "attempts": 0
            }
        )

        attempts = (

            current["attempts"]

            + 1
        )

        # ================================
        # LOCK AFTER 5 ATTEMPTS
        # ================================
        if attempts >= 5:

            login_attempts[

                otp_key

            ] = {

                "attempts":

                attempts,

                "locked_until":

                current_time + 600
            }

            return "OTP_LOCKED"

        # ================================
        # SAVE ATTEMPTS
        # ================================
        login_attempts[

            otp_key

        ] = {

            "attempts":

            attempts
        }

        return "INVALID_OTP"

    # =====================================
    # SUCCESS
    # =====================================
    login_attempts.pop(

        otp_key,

        None
    )

    otp_store.pop(

        identifier,

        None
    )

    return "OTP_VERIFIED"

# =========================================
# VERIFY JWT TOKEN
# =========================================
def verify_token(token):

    # =====================================
    # CHECK BLACKLIST
    # =====================================
    if token in blacklisted_tokens:

        return None

    # =====================================
    # CHECK SESSION EXISTS
    # =====================================
    session = sessions_collection.find_one({

        "accessToken": token
    })

    if not session:

        return None

    try:

        decoded = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=["HS256"]
        )

        return decoded

    # =====================================
    # TOKEN EXPIRED
    # =====================================
    except jwt.ExpiredSignatureError:

        sessions_collection.delete_one({

            "accessToken": token
        })

        return "TOKEN_EXPIRED"

    # =====================================
    # INVALID TOKEN
    # =====================================
    except jwt.InvalidTokenError:

        return None