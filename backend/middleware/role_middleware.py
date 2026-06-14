from functools import wraps

from flask import request, jsonify

# =========================================
# ROLE REQUIRED DECORATOR
# =========================================
def role_required(allowed_roles):

    def decorator(f):

        @wraps(f)

        def decorated(*args, **kwargs):

            user = request.user

            role = user.get("role")

            if role not in allowed_roles:

                return jsonify({
                    "error": "Access denied"
                }), 403

            return f(*args, **kwargs)

        return decorated

    return decorator