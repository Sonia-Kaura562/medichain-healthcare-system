from flask import Blueprint, request, jsonify

from routes.record_routes import update_summary

import json

from io import BytesIO

from datetime import datetime

from middleware.auth_middleware import jwt_required

from middleware.role_middleware import role_required

from middleware.access_middleware import access_required

from db import (

    records_collection,

    access_collection,

    users_collection
)

from services.ipfs_service import PinataService

from services.audit_service import log_action

from services.blockchain_service import add_medical_record

from services.encryption_service import (

    encrypt_data
)

from bson import ObjectId
ipfs = PinataService()
doctor_bp = Blueprint('doctor', __name__)

# =========================================
# CREATE SECURE MEDICAL RECORD
# =========================================
@doctor_bp.route('/create-record-secure', methods=['POST'])
@jwt_required
@role_required(["doctor"])
@access_required("update")
def create_secure():

    data = request.json

    try:

        payload = json.dumps({

            "patientId": data['patientId'],

            "doctorId": data['doctorId'],

            "hospitalId": data['hospitalId'],

            "disease": data['disease'],

            "treatment": data['treatment'],

            "status": data['status']
        })

        encrypted = encrypt_data(payload)

        file_obj = BytesIO(
            encrypted.encode()
        )

        file_obj.filename = "record.txt"

        ipfs_hash = ipfs.upload(file_obj)

        tx = add_medical_record({

            "patientId": data['patientId'],

            "doctorId": data['doctorId'],

            "hospitalId": data['hospitalId'],

            "disease": data['disease'],

            "treatment": data['treatment'],

            "ipfsHash": ipfs_hash,

            "status": data['status']
        })

        records_collection.insert_one({

            "patientId": data['patientId'],

            "doctorId": data['doctorId'],

            "hospitalId": data['hospitalId'],

            "disease": data['disease'],

            "treatment": data['treatment'],

            "status": data['status'],

            "cid": ipfs_hash,

            "txHash": tx,

            "timestamp": datetime.utcnow()
        })

        update_summary(

            data['patientId'],

            data['disease'],

            data['status'],

            data['doctorId'],

            data['hospitalId']
        )

        # =====================================
        # AUDIT LOG
        # =====================================
        log_action(

            request.user["userId"],

            request.user["role"],

            "CREATE_RECORD",

            data["patientId"]
        )

        return jsonify({

            "message": "Medical record added",

            "txHash": tx,

            "cid": ipfs_hash
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =========================================
# VERIFY RECORD
# =========================================
@doctor_bp.route(

    '/verify-record',

    methods=['POST']
)
@jwt_required
@role_required(["doctor"])
@access_required("update")
def verify_record():

    data = request.json

    record_id = data.get(

        "recordId"
    )

    patient_id = data.get(

        "patientId"
    )

    if not record_id or not patient_id:

        return jsonify({

            "error":

            "recordId and patientId required"

        }), 400

    record = records_collection.find_one({

        "recordId":

        record_id,

        "patientId":

        patient_id,

        "isArchived":

        False
    })

    if not record:

        return jsonify({

            "error":

            "Record not found"

        }), 404

    records_collection.update_one(

        {
            "_id":

            record["_id"]
        },

        {
            "$set": {

                "status":

                "verified",

                "flagReason":

                None,

                "verifiedBy":

                request.user[

                    "userId"
                ],

                "verifiedAt":

                datetime.utcnow()
            }
        }
    )

    log_action(

        request.user["userId"],

        request.user["role"],

        "VERIFY_RECORD",

        patient_id
    )

    return jsonify({

        "message":

        "Record verified successfully"
    })


# =========================================
# FLAG RECORD
# =========================================
@doctor_bp.route(

    '/flag-record',

    methods=['POST']
)
@jwt_required
@role_required(["doctor"])
@access_required("update")
def flag_record():

    data = request.json

    record_id = data.get(

        "recordId"
    )

    patient_id = data.get(

        "patientId"
    )

    reason = data.get(

        "reason"
    )

    if (

        not record_id

        or

        not patient_id

        or

        not reason

        or

        not reason.strip()
    ):

        return jsonify({

            "error":

            "recordId, patientId and reason required"

        }), 400

    record = records_collection.find_one({

        "recordId":

        record_id,

        "patientId":

        patient_id,

        "isArchived":

        False
    })

    if not record:

        return jsonify({

            "error":

            "Record not found"

        }), 404

    records_collection.update_one(

        {
            "_id":

            record["_id"]
        },

        {
            "$set": {

                "status":

                "flagged",

                "flagReason":

                reason.strip(),

                "verifiedBy":

                None,

                "verifiedAt":

                None
            }
        }
    )

    log_action(

        request.user["userId"],

        request.user["role"],

        "FLAG_RECORD",

        patient_id
    )

    return jsonify({

        "message":

        "Record flagged successfully"
    })

# =========================================
# DOCTOR PATIENT LIST
# =========================================
@doctor_bp.route(

    '/my-patients',

    methods=['GET']
)
@jwt_required
@role_required(["doctor"])
def my_patients():

    try:

        wallet_address = request.user.get(

            "walletAddress"
        )

        access_list = list(

            access_collection.find({

                "doctorWallet":

                wallet_address
            })
        )

        patients = []

        for access in access_list:

            patient = users_collection.find_one({

                "userId":

                access[

                    "patientId"
                ],

                "role":

                "patient"
            })

            if patient:

                patients.append({

                    "patientId":

                    patient[

                        "userId"
                    ],

                    "fullName":

                    patient.get(

                        "fullName"
                    ),

                    "email":

                    patient.get(

                        "email"
                    ),

                    "walletAddress":

                    patient.get(

                        "walletAddress"
                    ),

                    "canRead":

                    access.get(

                        "canRead"
                    ),

                    "canUpdate":

                    access.get(

                        "canUpdate"
                    ),

                    "expiryTime":

                    access.get(

                        "expiryTime"
                    )
                })

        return jsonify(

            patients
        )

    except Exception as e:

        return jsonify({

            "error":

            str(e)
        }), 500