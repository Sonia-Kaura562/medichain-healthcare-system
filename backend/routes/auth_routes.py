from middleware.role_middleware import role_required
from db import sessions_collection
import re
from db import users_collection
from flask import Blueprint, request, jsonify
import jwt
import bcrypt
from datetime import datetime, timedelta
from middleware.auth_middleware import jwt_required
from config import SECRET_KEY
from services.auth_service import (

    send_otp,

    verify_otp,

    set_pin,

    login,

    send_forgot_pin_otp,

    verify_forgot_pin_otp
)

from services.auth_service import blacklisted_tokens
auth_bp = Blueprint('auth', __name__)
import phonenumbers
# =========================================
# SEND OTP
# =========================================
@auth_bp.route('/send-otp', methods=['POST'])
def send_otp_route():

    data = request.json

    contact = data.get("contact")

    email = data.get("email")

    full_name = data.get("fullName")

    country = data.get(

        "country"
    )

    if not country:

        return jsonify({

            "error":
            "Country is required"

        }), 400

    country = country.upper()

    role = data.get("role", "patient")

    # =====================================
    # VALIDATE ROLE
    # =====================================
    allowed_roles = [

        "patient",

        "doctor",

        "admin"
    ]

    if role not in allowed_roles:

        return jsonify({
            "error": "Invalid role"
        }), 400
    if not contact and not email:

        return jsonify({
            "error": "Contact or email required"
        }), 400
    
    # =====================================
    # VALIDATE CONTACT
    # =====================================
    if contact:

        try:

            parsed_number = (

                phonenumbers.parse(

                    contact,

                    country
                )
            )

            if not phonenumbers.is_valid_number(

                parsed_number
            ):

                return jsonify({

                    "error":
                    "Invalid contact number"

                }), 400

        except:

            return jsonify({

                "error":
                "Invalid contact number"

            }), 400

    # =====================================
    # VALIDATE EMAIL
    # =====================================
    if email:

        if not re.fullmatch(

            r"[^@]+@[^@]+\.[^@]+",

            email
        ):

            return jsonify({
                "error": "Invalid email address"
            }), 400

    # =====================================
    # CHECK EXISTING CONTACT
    # =====================================
    if contact:

        existing_contact = users_collection.find_one({

            "contact": contact
        })

        if existing_contact:

            # Active account
            if existing_contact.get(
                "accountStatus"
            ) == "active":

                return jsonify({

                    "error":
                    "Contact number already registered"

                }), 400

            # Pending account
            if existing_contact.get(
                "accountStatus"
            ) == "pending":

                pass
    # =====================================
    # CHECK EXISTING EMAIL
    # =====================================
    if email:

        existing_email = users_collection.find_one({

            "email": email
        })

        if existing_email:

            # Active account
            if existing_email.get(
                "accountStatus"
            ) == "active":

                return jsonify({

                    "error":
                    "Email already registered"

                }), 400

            # Pending account
            if existing_email.get(
                "accountStatus"
            ) == "pending":

                pass

    identifier = contact if contact else email

    try:

        otp = send_otp(

            identifier=identifier,

            email=email,

            role=role,

            full_name=full_name,

            country=country
        )

        # =====================================
        # EMAIL DELIVERY FAILED
        # =====================================
        if isinstance(otp, dict):

            return jsonify({

                "error":

                otp["message"]

            }), 400

        return jsonify({

            "message":

            "OTP sent successfully"
        })

    except Exception as e:

        print(

            "SEND OTP ERROR:",

            str(e)
        )

        return jsonify({

            "error":

            "Failed to send OTP"

        }), 500

# =========================================
# VERIFY OTP
# =========================================
@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp_route():

    data = request.json

    user_data, role = verify_otp(data)

    # =====================================
    # OTP EXPIRED
    # =====================================
    if user_data == "OTP_EXPIRED":

        return jsonify({
            "error": "OTP expired"
        }), 400

    # =====================================
    # TOO MANY ATTEMPTS
    # =====================================
    if user_data == "TOO_MANY_ATTEMPTS":

        return jsonify({
            "error":
            "Too many failed attempts. Request a new OTP."
        }), 429

    # =====================================
    # OTP NOT FOUND
    # =====================================
    if user_data == "OTP_NOT_FOUND":

        return jsonify({
            "error":
            "Session expired. Please request a new OTP."
        }), 400

    # =====================================
    # INVALID OTP
    # =====================================
    if user_data == "INVALID_OTP":

        return jsonify({
            "error":
            "Invalid OTP"
        }), 400

    return jsonify({

        "message":
        "OTP verified",

        "userId":
        user_data,

        "role":
        role
    })
# =========================================
# SET PIN
# =========================================
@auth_bp.route('/set-pin', methods=['POST'])
def set_pin_route():

    data = request.json

    user_data = data.get(
        "userData"
    )

    password = data.get(
        "password"
    )

    wallet_address = data.get(
        "walletAddress"
    )

    if wallet_address:

        wallet_address = (

            wallet_address
            .strip()
            .lower()
        )

    if not user_data or not password:

        return jsonify({
            "error":
            "userId and pin required"
        }), 400

    # =====================================
    # VALIDATE PASSWORD
    # =====================================
    password_regex = (

        r"^(?=.*[a-z])"
        r"(?=.*[A-Z])"
        r"(?=.*\d)"
        r"(?=.*[@$!%*?&])"
        r".{10,}$"
    )

    if not re.match(

        password_regex,

        password
    ):

        return jsonify({

            "error":

            "Password must contain at least 10 characters, one uppercase letter, one lowercase letter, one number and one special character."

        }), 400

    # =====================================
    # VALIDATE WALLET ADDRESS
    # =====================================
    if wallet_address:

        wallet_regex = (

            r"^0x[a-fA-F0-9]{40}$"
        )

        if not re.match(

            wallet_regex,

            wallet_address
        ):

            return jsonify({

                "error":
                "Invalid wallet address"

            }), 400

    # =====================================
    # CHECK WALLET ALREADY EXISTS
    # =====================================
    if wallet_address:

        existing_wallet = (

            users_collection.find_one({

                "walletAddress": {

                    "$regex":
                    f"^{wallet_address}$",

                    "$options": "i"
                }
            })
        )

        if existing_wallet:

            return jsonify({

                "error":
                "Wallet already linked to another account"

            }), 400
    # =====================================
    # SET PIN
    # =====================================
    user_id = set_pin(

        user_data,

        password,

        wallet_address
    )

    return jsonify({

        "message":
        "PIN set successfully",

        "userId":
        user_id
    })

# =========================================
# LOGIN
# =========================================
@auth_bp.route('/login', methods=['POST'])
def login_route():

    data = request.json

    identifier = data.get(

        "identifier"
    )

    password = data.get(

        "password"
    )

    result = login(

        identifier,

        password
    )

    if result == "ACCOUNT_LOCKED":

        return jsonify({

            "error":
            "Account locked for 15 minutes"

        }), 403

    if result == "ACCOUNT_PENDING":

        return jsonify({

            "error":
            "Account setup incomplete. Please complete password setup."

        }), 403

    if not result:

        return jsonify({
            "error": "Invalid credentials"
        }), 401

    return jsonify(result)

# =========================================
# FORGOT PIN - SEND OTP
# =========================================
@auth_bp.route(

    '/forgot-pin/send-otp',

    methods=['POST']
)
def forgot_pin_send_otp_route():

    data = request.json

    identifier = data.get(

        "identifier"
    )

    if not identifier:

        return jsonify({

            "error":

            "Email, phone or GPID required"

        }), 400

    result = send_forgot_pin_otp(

        identifier
    )

    if result == "USER_NOT_FOUND":

        return jsonify({

            "error":

            "Account not found"

        }), 404

    if result == "EMAIL_NOT_FOUND":

        return jsonify({

            "error":

            "No email linked to account"

        }), 400

    if result == "EMAIL_FAILED":

        return jsonify({

            "error":

            "Failed to send OTP"

        }), 500

    return jsonify({

        "message":

        "OTP sent successfully"
    })

# =========================================
# VERIFY FORGOT PIN OTP
# =========================================
@auth_bp.route(

    '/forgot-pin/verify-otp',

    methods=['POST']
)
def forgot_pin_verify_otp_route():

    data = request.json

    identifier = data.get(

        "identifier"
    )

    otp = data.get(

        "otp"
    )

    if not identifier or not otp:

        return jsonify({

            "error":

            "identifier and otp required"

        }), 400

    result = verify_forgot_pin_otp(

        identifier,

        otp
    )

    if result == "OTP_NOT_FOUND":

        return jsonify({

            "error":

            "OTP not found"

        }), 404

    if result == "OTP_EXPIRED":

        return jsonify({

            "error":

            "OTP expired"

        }), 400

    if result == "OTP_LOCKED":

        return jsonify({

            "error":

            "Too many failed attempts. Try again after 10 minutes."

        }), 403

    if result == "INVALID_OTP":

        return jsonify({

            "error":

            "Invalid OTP"

        }), 400

    return jsonify({

        "message":

        "OTP verified"
    })


# =========================================
# GET ALL DOCTORS
# =========================================
@auth_bp.route('/doctors', methods=['GET'])
@jwt_required
@role_required(["patient"])
def get_doctors():

    doctors = list(users_collection.find(

        {
            "role": "doctor"
        },

        {
            "_id": 0,

            "userId": 1,

            "contact": 1,

            "walletAddress": 1
        }
    ))

    return jsonify(doctors)

# =========================================
# RESET PIN
# =========================================
@auth_bp.route('/reset-pin', methods=['POST'])
def reset_pin_route():

    data = request.json

    identifier = data.get(

        "identifier"
    )

    new_pin = data.get(

        "newPin"
    )

    # =====================================
    # REQUIRED FIELDS
    # =====================================
    if not identifier or not new_pin:

        return jsonify({

            "error":

            "identifier and newPassword required"

        }), 400

    # =====================================
    # VALIDATE PASSWORD
    # =====================================
    password_regex = (

        r"^(?=.*[a-z])"
        r"(?=.*[A-Z])"
        r"(?=.*\d)"
        r"(?=.*[@$!%*?&])"
        r".{10,}$"
    )

    if not re.match(

        password_regex,

        new_pin
    ):

        return jsonify({

            "error":

            "Password must contain at least 10 characters, one uppercase letter, one lowercase letter, one number and one special character."

        }), 400

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

        return jsonify({

            "error":

            "User not found"

        }), 404

    # =====================================
    # HASH NEW PIN
    # =====================================
    hashed_pin = bcrypt.hashpw(

        new_pin.encode(

            "utf-8"
        ),

        bcrypt.gensalt()
    )

    # =====================================
    # UPDATE PIN ONLY
    # =====================================
    users_collection.update_one(

        {

            "userId":

            user["userId"]
        },

        {

            "$set": {

                "password":

                hashed_pin
            }
        }
    )

    return jsonify({

        "message":

        "PASSWORD reset successfully"
    })

# =========================================
# REFRESH TOKEN
# =========================================
@auth_bp.route('/refresh-token', methods=['POST'])
def refresh_token_route():

    data = request.json

    refresh_token = data.get("refreshToken")

    if not refresh_token:

        return jsonify({
            "error": "Refresh token required"
        }), 400

    try:

        # =====================================
        # DECODE REFRESH TOKEN
        # =====================================
        decoded = jwt.decode(

            refresh_token,

            SECRET_KEY,

            algorithms=["HS256"]
        )

        # =====================================
        # VALIDATE TOKEN TYPE
        # =====================================
        if decoded.get("type") != "refresh":

            return jsonify({
                "error": "Invalid refresh token"
            }), 401

        # =====================================
        # CHECK USER EXISTS
        # =====================================
        user = users_collection.find_one({

            "userId": decoded["userId"]
        })

        if not user:

            return jsonify({
                "error": "User not found"
            }), 404

        # =====================================
        # GENERATE NEW ACCESS TOKEN
        # =====================================
        new_access_token = str(jwt.encode(

            {

                "userId": user["userId"],

                "role": user["role"],

                "walletAddress": user.get("walletAddress"),

                "exp": datetime.utcnow() + timedelta(minutes=15)

            },

            SECRET_KEY,

            algorithm="HS256"
        ))

        # =====================================
        # STORE SESSION
        # =====================================
        sessions_collection.insert_one({

            "userId": user["userId"],

            "accessToken": new_access_token,

            "createdAt": datetime.utcnow()
        })

        return jsonify({

            "accessToken": new_access_token
        })

    except jwt.ExpiredSignatureError:

        return jsonify({
            "error": "Refresh token expired"
        }), 401

    except jwt.InvalidTokenError:

        return jsonify({
            "error": "Invalid refresh token"
        }), 401

    except Exception as e:

        print("Refresh Token Error:", e)

        return jsonify({
            "error": "Something went wrong"
        }), 500
    
# =========================================
# LOGOUT
# =========================================
@auth_bp.route('/logout', methods=['POST'])

@jwt_required

def logout_route():

    try:

        token = request.headers.get(

            "Authorization"

        ).split(" ")[1]

        blacklisted_tokens.add(token)

        sessions_collection.delete_one({

            "accessToken": token
        })

        return jsonify({

            "message": "Logout successful"
        })

    except Exception:

        return jsonify({

            "error": "Invalid token format"
        }), 401


# =========================================
# GET PROFILE
# =========================================
@auth_bp.route(

    '/profile',

    methods=['GET']
)
@jwt_required
def get_profile_route():

    user = users_collection.find_one(

        {

            "userId":

            request.user[

                "userId"
            ]
        },

        {

            "_id": 0,

            "fullName": 1,

            "email": 1,

            "contact": 1,

            "userId": 1,

            "role": 1,

            "walletAddress": 1,

            "walletType": 1
        }
    )

    if not user:

        return jsonify({

            "error":

            "User not found"
        }), 404

    return jsonify(user)


# =========================================
# CHANGE PIN
# =========================================
@auth_bp.route(

    '/change-pin',

    methods=['POST']
)
@jwt_required
def change_pin_route():

    data = request.json

    current_pin = data.get(

        "currentPin"
    )

    new_pin = data.get(

        "newPin"
    )

    # =====================================
    # REQUIRED FIELDS
    # =====================================
    if not current_pin or not new_pin:

        return jsonify({

            "error":

            "currentPin and newPin required"

        }), 400

    # =====================================
    # VALIDATE NEW PIN
    # =====================================
    if len(new_pin) != 6:

        return jsonify({

            "error":

            "PIN must be exactly 6 digits"

        }), 400

    if not new_pin.isdigit():

        return jsonify({

            "error":

            "PIN must contain only numbers"

        }), 400

    # =====================================
    # GET USER
    # =====================================
    user = users_collection.find_one({

        "userId":

        request.user[

            "userId"
        ]
    })

    if not user:

        return jsonify({

            "error":

            "User not found"

        }), 404

    # =====================================
    # VERIFY CURRENT PIN
    # =====================================
    stored_hash = bytes(

        user["pin"]
    )

    valid = bcrypt.checkpw(

        current_pin.encode(

            "utf-8"
        ),

        stored_hash
    )

    if not valid:

        return jsonify({

            "error":

            "Current PIN incorrect"

        }), 401

    # =====================================
    # HASH NEW PIN
    # =====================================
    hashed_pin = bcrypt.hashpw(

        new_pin.encode(

            "utf-8"
        ),

        bcrypt.gensalt()
    )

    # =====================================
    # UPDATE PIN
    # =====================================
    users_collection.update_one(

        {

            "userId":

            user["userId"]
        },

        {

            "$set": {

                "password":

                hashed_pin
            }
        }
    )

    return jsonify({

        "message":

        "PIN changed successfully"
    })



@auth_bp.route('/protected', methods=['GET'])
@jwt_required
def protected_route():

    return jsonify({

    "message": "Protected route accessed",

    "userId": request.user["userId"],

    "role": request.user["role"]
})

@auth_bp.route('/patient-only', methods=['GET'])

@jwt_required

@role_required(["patient"])

def patient_only():

    return jsonify({

        "message": "Patient access granted"
    })


@auth_bp.route('/doctor-only', methods=['GET'])

@jwt_required

@role_required(["doctor"])

def doctor_only():

    return jsonify({

        "message": "Doctor access granted"
    })


@auth_bp.route('/admin-only', methods=['GET'])

@jwt_required

@role_required(["admin"])

def admin_only():

    return jsonify({

        "message": "Admin access granted"
    })

# =========================================
# RESEND FORGOT PIN OTP
# =========================================
@auth_bp.route(

    '/forgot-pin/resend-otp',

    methods=['POST']
)
def forgot_pin_resend_otp_route():

    data = request.json

    identifier = data.get(

        "identifier"
    )

    if not identifier:

        return jsonify({

            "error":

            "Identifier required"

        }), 400

    result = send_forgot_pin_otp(

        identifier
    )

    if result == "USER_NOT_FOUND":

        return jsonify({

            "error":

            "Account not found"

        }), 404

    if result == "EMAIL_NOT_FOUND":

        return jsonify({

            "error":

            "No email linked to account"

        }), 400

    if result == "WAIT_BEFORE_RESEND":

        return jsonify({

            "error":

            "Please wait before requesting another OTP"

        }), 429

    if result == "EMAIL_FAILED":

        return jsonify({

            "error":

            "Failed to send OTP"

        }), 500

    return jsonify({

        "message":

        "OTP resent successfully"
    })