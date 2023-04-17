package com.dbs.fixmp.mobilebff

data class BioEnrollmentRequest(
        val userId: String,
        val appId: String,
        val deviceId: String,

        // base64 string of the public key
        val publicKey: String,
)

data class BioLoginRequest(
        val userId: String,
        val appId: String,
        val deviceId: String,

        // the signed content (most likely just a json of the other fields)
        val payload: String,

        // the signature for the payload
        val signature: String,
)