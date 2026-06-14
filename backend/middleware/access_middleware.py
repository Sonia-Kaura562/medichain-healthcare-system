from functools import wraps

from flask import request, jsonify

from services.blockchain_service import check_access

from services.audit_service import log_action

import time

from db import records_collection
# =========================================
# BLOCKCHAIN ACCESS CHECK
# =========================================
def access_required(access_type="read"):

    def decorator(f):

        @wraps(f)

        def decorated(*args, **kwargs):

            user = request.user

            role = user.get("role")

            # Patients always allowed
            if role == "patient":

                return f(*args, **kwargs)

            # =====================================
            # GET PATIENT ID
            # =====================================
            patient_id = kwargs.get("patient_id")

            # =====================================
            # FOR POST ROUTES
            # =====================================
            if not patient_id:

                data = request.json

                if data:

                    patient_id = data.get(

                        "patientId"
                    )

            # =====================================
            # FOR RECORD ROUTES
            # /view-record/<record_id>
            # /download-record/<record_id>
            # =====================================
            if not patient_id:

                record_id = kwargs.get(

                    "record_id"
                )

                if record_id:

                    record = (

                        records_collection.find_one({

                            "recordId":

                            record_id
                        })
                    )

                    if record:

                        patient_id = record.get(

                            "patientId"
                        )

            if not patient_id:

                return jsonify({
                    "error": "Patient ID missing"
                }), 400

            # =====================================
            # GET WALLET
            # =====================================
            wallet_address = user.get("walletAddress")

            access = check_access(

                patient_id,

                wallet_address
            )

            # =====================================
            # ACCESS NEVER GRANTED
            # =====================================
            if access["expiryTime"] == 0:

                log_action(

                    user["userId"],

                    user["role"],

                    "ACCESS_NOT_GRANTED",

                    patient_id
                )

                return jsonify({
                    "error": "Access not granted"
                }), 403

            # =====================================
            # ACCESS EXPIRED
            # =====================================
            if access["expiryTime"] < int(time.time()):

                log_action(

                    user["userId"],

                    user["role"],

                    "ACCESS_EXPIRED",

                    patient_id
                )

                return jsonify({
                    "error": "Access expired"
                }), 403

            # =====================================
            # READ ACCESS CHECK
            # =====================================
            if access_type == "read" and not access["canRead"]:

                log_action(

                    user["userId"],

                    user["role"],

                    "READ_ACCESS_DENIED",

                    patient_id
                )

                return jsonify({
                    "error": "Read access denied"
                }), 403

            # =====================================
            # UPDATE ACCESS CHECK
            # =====================================
            if access_type == "update" and not access["canUpdate"]:

                log_action(

                    user["userId"],

                    user["role"],

                    "UPDATE_ACCESS_DENIED",

                    patient_id
                )

                return jsonify({
                    "error": "Update access denied"
                }), 403

            return f(*args, **kwargs)

        return decorated

    return decorator