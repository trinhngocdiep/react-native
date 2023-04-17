package com.dbs.fixmp.mobilebff

import jakarta.persistence.*

@Entity
@Table(
        uniqueConstraints = [UniqueConstraint(columnNames = arrayOf("user_id", "device_id", "device_id"))]
)
class BioKey {

    @Id
    @GeneratedValue
    var id: Long = 0

    @Column(length = 1024)
    var keyBase64: String = ""

    @Column(name = "user_id")
    var userId: String = ""

    @Column(name = "device_id")
    var deviceId: String = ""

    @Column(name = "app_id")
    var appId: String = ""
}