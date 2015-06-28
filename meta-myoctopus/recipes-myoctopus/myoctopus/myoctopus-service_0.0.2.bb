SUMMARY = "My Octopus host software daemon"
LICENSE = "BSD"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b3cb8d8f023026f3a1204ea334572c80"

SYSTEMD_SERVICE_${PN} = "myoctopus.service"

SRC_URI = "file://myoctopus.service"
SRC_URI += "file://run.py;md5=cbf96c48f3e1e1d2de5cbc3879ab793e"
SRC_URI += "file://i2c_group.rules;md5=bfb3a5f127f707ecc56ab18f700ecdfb"
SRC_URI += "file://LICENSE"
SRC_URI[md5sum] = "0a39bf4bb513f7e5c67cf16f4d1b7c5c"
SRC_URI[sha256sum] = "04f8bd6e68b02cc7f963f273e0c8ba750a09e7b884cd4cf7f3b9fd921114ac6d"

S = "${WORKDIR}"

inherit systemd useradd

USERADD_PACKAGES = "${PN}"
USERADD_PARAM_${PN} = "-u 1200 -g myoctopus -G i2c -d ${datadir}/myoctopus -r -s /bin/sh -P 'octopus' myoctopus"
GROUPADD_PARAM_${PN} = "-g 900 myoctopus; -g 901 i2c"

do_install() {
        install -d -m 755 ${D}${sysconfdir}/udev/rules.d
        install -d -m 755 ${D}${datadir}/myoctopus
        install -m 644 ${WORKDIR}/i2c_group.rules ${D}${sysconfdir}/udev/rules.d/i2c_group.rules
        install -d ${D}/${systemd_unitdir}/system
        install -m 644 ${WORKDIR}/myoctopus.service ${D}/${systemd_unitdir}/system
        install -p -m 644 run.py ${D}${datadir}/myoctopus/
	      chown -R myoctopus ${D}${datadir}/myoctopus
	      chgrp -R myoctopus ${D}${datadir}/myoctopus
}

FILES_${PN} = "${base_libdir}/systemd/system/myoctopus.service"
FILES_${PN} += "${datadir}/myoctopus/*"
FILES_${PN} += "${sysconfdir}/udev/rules.d/i2c_group.rules"

RDEPENDS_${PN} = "myoctopus udev"

