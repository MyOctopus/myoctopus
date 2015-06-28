SUMMARY = "My Octopus host software daemon"
LICENSE = "BSD"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b3cb8d8f023026f3a1204ea334572c80"

SYSTEMD_SERVICE_${PN} = "myoctopus.service"

SRC_URI = "file://myoctopus.service"
SRC_URI += "file://run.py;md5=b15f13c11b28d7db45a20726fc524e93"
SRC_URI += "file://LICENSE"
SRC_URI[md5sum] = "e593d21cea78535fb32ed5815c9ea12c"
SRC_URI[sha256sum] = "96464600e1b0f7f3ab46dad0c328156fb9bcba8aca3f097dbb21f01820c8f976"

S = "${WORKDIR}"

inherit systemd useradd

USERADD_PACKAGES = "${PN}"
USERADD_PARAM_${PN} = "-u 1200 -g myoctopus -d ${D}${datadir}/myoctopus -r -s /bin/sh -P 'octopus' myoctopus"
GROUPADD_PARAM_${PN} = "-g 900 myoctopus"

do_install() {
        install -d -m 755 ${D}${datadir}/myoctopus

        # Copy service file
        install -d ${D}/${systemd_unitdir}/system
        install -c -m 644 ${WORKDIR}/myoctopus.service ${D}/${systemd_unitdir}/system
        
        install -p -m 644 run.py ${D}${datadir}/myoctopus/
        
	chown -R myoctopus ${D}${datadir}/myoctopus

	chgrp -R myoctopus ${D}${datadir}/myoctopus
}

FILES_${PN} = "${base_libdir}/systemd/system/myoctopus.service"
FILES_${PN} += "${datadir}/myoctopus/*"

INHIBIT_PACKAGE_DEBUG_SPLIT = "1"