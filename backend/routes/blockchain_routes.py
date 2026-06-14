from flask import Blueprint, jsonify

from middleware.auth_middleware import jwt_required

from middleware.access_middleware import access_required

from services.blockchain_service import (

    get_all_records,

    get_record_count
)

blockchain_bp = Blueprint('blockchain', __name__)

# =========================================
# GET BLOCKCHAIN RECORDS
# =========================================
@blockchain_bp.route('/blockchain-records/<patient_id>', methods=['GET'])
@jwt_required
@access_required("read")
def blockchain_records(patient_id):

    try:

        records = get_all_records(patient_id)

        formatted = []

        for r in records:

            formatted.append({

                "patientId": r[0],

                "doctorId": r[1],

                "hospitalId": r[2],

                "disease": r[3],

                "treatment": r[4],

                "ipfsHash": r[5],

                "status": r[6],

                "version": r[7],

                "timestamp": r[8],

                "updatedBy": r[9]
            })

        return jsonify(formatted)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =========================================
# RECORD COUNT
# =========================================
@blockchain_bp.route('/record-count/<patient_id>', methods=['GET'])
@jwt_required
def record_count(patient_id):

    try:

        count = get_record_count(patient_id)

        return jsonify({
            "count": count
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

