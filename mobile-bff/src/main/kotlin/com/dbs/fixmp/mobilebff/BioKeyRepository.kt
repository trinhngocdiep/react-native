package com.dbs.fixmp.mobilebff

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface BioKeyRepository : CrudRepository<BioKey, Long> {
    @Query("""
        select k from BioKey k where k.userId = :userId and k.appId = :appId and k.deviceId = :deviceId
    """)
    fun findKey(userId: String, appId: String, deviceId: String): Optional<BioKey>
}