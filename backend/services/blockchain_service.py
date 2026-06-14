import json
from web3 import Web3
import os
from dotenv import load_dotenv

load_dotenv()

# =========================================
# ENV VARIABLES
# =========================================

PRIVATE_KEY = os.getenv("PRIVATE_KEY")

account = Web3.to_checksum_address(
    os.getenv("ACCOUNT_ADDRESS")
)

contract_address = Web3.to_checksum_address(
    os.getenv("CONTRACT_ADDRESS")
)

w3 = Web3(
    Web3.HTTPProvider(os.getenv("RPC_URL"))
)

# =========================================
# LOAD ABI FROM HARDHAT ARTIFACT
# =========================================

artifact_path = "../blockchain/artifacts/contracts/HealthcareEHR.sol/HealthcareEHR.json"

with open(artifact_path, "r") as file:

    contract_json = json.load(file)

contract_abi = contract_json["abi"]

# =========================================
# CONTRACT INSTANCE
# =========================================

contract = w3.eth.contract(
    address=contract_address,
    abi=contract_abi
)

# =========================================
# SEND TRANSACTION
# =========================================

def send_transaction(tx):

    signed_tx = w3.eth.account.sign_transaction(
        tx,
        PRIVATE_KEY
    )

    tx_hash = w3.eth.send_raw_transaction(
        signed_tx.raw_transaction
    )

    w3.eth.wait_for_transaction_receipt(tx_hash)

    return tx_hash.hex()

# =========================================
# ADD MEDICAL RECORD
# =========================================

def add_medical_record(data):

    nonce = w3.eth.get_transaction_count(account)

    tx = contract.functions.addMedicalRecord(

        data['patientId'],

        data['doctorId'],

        data['hospitalId'],

        data['disease'],

        data['treatment'],

        data['ipfsHash'],

        data['status']

    ).build_transaction({

        'from': account,

        'nonce': nonce,

        'gas': 3000000,

        'gasPrice': w3.to_wei('20', 'gwei')
    })

    return send_transaction(tx)

# =========================================
# GET ALL RECORDS
# =========================================

def get_all_records(patient_id):

    return contract.functions.getAllRecords(
        patient_id
    ).call({
        'from': account
    })

# =========================================
# GET RECORD COUNT
# =========================================

def get_record_count(patient_id):

    return contract.functions.getRecordCount(
        patient_id
    ).call()

# =========================================
# GRANT ACCESS
# =========================================

def grant_access(data):

    nonce = w3.eth.get_transaction_count(account)

    tx = contract.functions.grantAccess(

        data['patientId'],

        Web3.to_checksum_address(
            data['doctorWallet']
        ),

        data['canRead'],

        data['canUpdate'],

        data['duration']

    ).build_transaction({

        'from': account,

        'nonce': nonce,

        'gas': 2000000,

        'gasPrice': w3.to_wei('20', 'gwei')
    })

    return send_transaction(tx)

# =========================================
# REVOKE ACCESS
# =========================================

def revoke_access(data):

    tx = contract.functions.revokeAccess(

        data['patientId'],

        Web3.to_checksum_address(

            data['doctorWallet']
        ),

        data['revokeRead'],

        data['revokeUpdate']

    ).transact({

        'from': account
    })

    receipt = w3.eth.wait_for_transaction_receipt(tx)

    return receipt.transactionHash.hex()

# =========================================
# CHECK ACCESS
# =========================================
def check_access(patient_id, wallet_address):

    access = contract.functions.permissions(

        patient_id,

        Web3.to_checksum_address(wallet_address)

    ).call()

    return {

        "canRead": access[0],

        "canUpdate": access[1],

        "expiryTime": access[2]
    }
