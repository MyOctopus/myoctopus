SUMMARY = "My Octopus host software daemon"
LICENSE = "BSD"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b3cb8d8f023026f3a1204ea334572c80"


inherit systemd

SYSTEMD_SERVICE_${PN} = "myoctopus.service"

#SRC_URI = "file://myoctopus_${PV}.tar.gz"
SRC_URI = "file://myoctopus.service"
SRC_URI += "file://run.py"
SRC_URI += "file://LICENSE"
SRC_URI[md5sum] = "e593d21cea78535fb32ed5815c9ea12c"
SRC_URI[sha256sum] = "96464600e1b0f7f3ab46dad0c328156fb9bcba8aca3f097dbb21f01820c8f976"

S = "${WORKDIR}/myoctopus_${PV}"

do_install() {
        install -d ${D}${bindir}
        install -m 0755 run.py ${D}${bindir}

        # Copy service file
        install -d ${D}/${systemd_unitdir}/system
        install -c -m 644 ${WORKDIR}/myoctopus.service ${D}/${systemd_unitdir}/system
}

FILES_${PN} = "${base_libdir}/systemd/system/run.py"
FILES_${PN} += "${bindir}/run.py"