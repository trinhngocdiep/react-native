package com.dbs.fixmp.mobilebff

import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.security.KeyFactory
import java.security.Signature
import java.security.spec.X509EncodedKeySpec
import java.util.*


@RestController
@RequestMapping("api/v1/bio")
class BioAuthController(private val bioKeyRepository: BioKeyRepository) {

    private var log = LoggerFactory.getLogger(BioAuthController::class.java)

    @PostMapping("register")
    fun register(@RequestBody req: BioEnrollmentRequest): Map<String, Any> {
        val record = BioKey().apply {
            appId = req.appId
            deviceId = req.deviceId
            userId = req.userId
            keyBase64 = req.publicKey
        }
        val existingKey = bioKeyRepository.findKey(
                userId = req.userId,
                appId = req.appId,
                deviceId = req.deviceId
        )
        if (existingKey.isPresent) {
            return mapOf(
                    "success" to false,
                    "message" to "key existed for user = ${req.userId}, app = ${req.appId}, device = ${req.deviceId})"
            )
        }
        bioKeyRepository.save(record)
        return mapOf(
                "success" to true,
                "id" to record.id
        )
    }

    @PostMapping("login")
    fun login(@RequestBody req: BioLoginRequest): Map<String, Any> {
        return bioKeyRepository.findKey(req.userId, req.appId, req.deviceId)
                .map { record ->
                    log.info("verifying payload")
                    // reconstruct the public key
                    val decoder = Base64.getDecoder()
                    val pubKey = KeyFactory.getInstance("RSA")
                            .generatePublic(X509EncodedKeySpec(decoder.decode(record.keyBase64)))
                    val signature = Signature.getInstance("SHA256withRSA")
                    signature.initVerify(pubKey)

                    // set the payload to be verified
                    signature.update(req.payload.toByteArray())

                    // verify the payload using the given signature
                    if (signature.verify(decoder.decode(req.signature))) {
                        return@map mapOf<String, Any>(
                                "success" to true,
                                "message" to "authenticated as ${req.userId} on (${req.deviceId} - ${req.appId})"
                        )
                    }
                    return@map mapOf<String, Any>(
                            "success" to false,
                            "message" to "wrong signature"
                    )
                }.orElse(mapOf<String, Any>(
                        "success" to false,
                        "message" to "key not found"
                ))
    }

}