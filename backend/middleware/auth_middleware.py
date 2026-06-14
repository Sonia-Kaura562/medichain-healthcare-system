from functools import wraps

from flask import request, jsonify

from services.auth_service import verify_token

# =========================================
# JWT REQUIRED DECORATOR
# =========================================
def jwt_required(f):

    @wraps(f)

    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:

            return jsonify({
                "error": "Token missing"
            }), 401

        try:

            token = auth_header.split(" ")[1]

        except:

            return jsonify({
                "error": "Invalid token format"
            }), 401

        decoded = verify_token(token)

        if decoded == "TOKEN_EXPIRED":

            return jsonify({
                "error": "Token expired"
            }), 401

        if not decoded:

            return jsonify({
                "error": "Invalid token"
            }), 401

        request.user = decoded

        return f(*args, **kwargs)

    return decorated
