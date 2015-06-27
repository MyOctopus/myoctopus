SUMMARY = "My Octopus host software"
LICENSE = "BSD"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b3cb8d8f023026f3a1204ea334572c80"

SRC_URI = "file://myoctopus_${PV}.tar.gz"
SRC_URI[md5sum] = "4e697c334eef1973bd249aaddeda826e"
SRC_URI[sha256sum] = "58624feacae09ce3b7ceb00fa85b5d969982bcc75315be7ab9ccded1c952be45"

S = "${WORKDIR}/myoctopus_${PV}"

inherit setuptools

RDEPENDS_${PN} = "python-modules python-flask"

