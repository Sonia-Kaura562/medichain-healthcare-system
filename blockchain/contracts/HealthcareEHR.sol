// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HealthcareEHR {

    // =========================================
    // MEDICAL RECORD STRUCTURE
    // =========================================
    struct MedicalRecord {

        string patientId;
        string doctorId;
        string hospitalId;

        string disease;
        string treatment;

        string ipfsHash;

        string status;

        uint256 version;
        uint256 timestamp;

        address updatedBy;
    }

    // =========================================
    // MULTIPLE RECORDS PER PATIENT
    // =========================================
    mapping(string => MedicalRecord[]) private patientRecords;

    // =========================================
    // ACCESS CONTROL
    // =========================================
    struct Access {

        bool canRead;
        bool canUpdate;

        uint256 expiryTime;
    }

    mapping(string => mapping(address => Access)) public permissions;

    // =========================================
    // EVENTS
    // =========================================
    event RecordAdded(
        string patientId,
        uint256 index,
        string disease,
        string status
    );

    event AccessGranted(
        string patientId,
        address user
    );

    event AccessRevoked(
        string patientId,
        address user
    );

    // =========================================
    // ADD MEDICAL RECORD
    // =========================================
    function addMedicalRecord(

        string memory patientId,
        string memory doctorId,
        string memory hospitalId,

        string memory disease,
        string memory treatment,

        string memory ipfsHash,

        string memory status

    ) public {

        // First record auto-gives owner access
        if (patientRecords[patientId].length == 0) {

            permissions[patientId][msg.sender] = Access({
                canRead: true,
                canUpdate: true,
                expiryTime: type(uint256).max
            });
        }

        // Check write access
        require(

            permissions[patientId][msg.sender].canUpdate &&
            permissions[patientId][msg.sender].expiryTime > block.timestamp,

            "Not authorized"
        );

        uint256 newVersion =
            patientRecords[patientId].length + 1;

        MedicalRecord memory newRecord = MedicalRecord({

            patientId: patientId,
            doctorId: doctorId,
            hospitalId: hospitalId,

            disease: disease,
            treatment: treatment,

            ipfsHash: ipfsHash,

            status: status,

            version: newVersion,

            timestamp: block.timestamp,

            updatedBy: msg.sender
        });

        patientRecords[patientId].push(newRecord);

        emit RecordAdded(
            patientId,
            patientRecords[patientId].length - 1,
            disease,
            status
        );
    }

    // =========================================
    // GET ALL RECORDS
    // =========================================
    function getAllRecords(
        string memory patientId
    )
        public
        view
        returns (MedicalRecord[] memory)
    {

        require(

            permissions[patientId][msg.sender].canRead &&
            permissions[patientId][msg.sender].expiryTime > block.timestamp,

            "Not authorized"
        );

        return patientRecords[patientId];
    }

    // =========================================
    // GET SINGLE RECORD
    // =========================================
    function getRecordByIndex(

        string memory patientId,
        uint256 index

    )
        public
        view
        returns (MedicalRecord memory)
    {

        require(

            permissions[patientId][msg.sender].canRead &&
            permissions[patientId][msg.sender].expiryTime > block.timestamp,

            "Not authorized"
        );

        require(
            index < patientRecords[patientId].length,
            "Invalid index"
        );

        return patientRecords[patientId][index];
    }

    // =========================================
    // GET TOTAL RECORD COUNT
    // =========================================
    function getRecordCount(
        string memory patientId
    )
        public
        view
        returns (uint256)
    {

        return patientRecords[patientId].length;
    }

    // =========================================
    // GRANT ACCESS
    // =========================================
    function grantAccess(

        string memory patientId,

        address user,

        bool canRead,

        bool canUpdate,

        uint256 duration

    ) public {

        permissions[patientId][user] = Access({

            canRead: canRead,

            canUpdate: canUpdate,

            expiryTime: block.timestamp + duration
        });

        emit AccessGranted(
            patientId,
            user
        );
    }

    // =========================================
    // REVOKE ACCESS
    // =========================================
    function revokeAccess(

        string memory patientId,

        address user,

        bool revokeRead,

        bool revokeUpdate

    ) public {

        Access storage access = permissions[patientId][user];

        if (revokeRead) {

            access.canRead = false;
        }

        if (revokeUpdate) {

            access.canUpdate = false;
        }

        if (

            access.canRead == false &&

            access.canUpdate == false
        ) {

            delete permissions[patientId][user];
        }

        emit AccessRevoked(patientId, user);
    }
    
    // =========================================
    // CHECK ACCESS
    // =========================================
    function checkAccess(

        string memory patientId,
        address user

    )
        public
        view
        returns (

            bool,
            bool,
            uint256
        )
    {

        Access memory accessData =
            permissions[patientId][user];

        return (

            accessData.canRead,

            accessData.canUpdate,

            accessData.expiryTime
        );
    }
}