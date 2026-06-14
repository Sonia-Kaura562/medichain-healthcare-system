from db import audit_collection

import datetime

# =========================================
# STORE AUDIT LOG
# =========================================
def log_action(

    user_id,

    role,

    action,

    patient_id

):

    audit_collection.insert_one({

        "userId": user_id,

        "role": role,

        "action": action,

        "patientId": patient_id,

        "timestamp": datetime.datetime.utcnow()
    })