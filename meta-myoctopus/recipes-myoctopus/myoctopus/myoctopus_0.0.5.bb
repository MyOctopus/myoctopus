SUMMARY = "My Octopus host software"
LICENSE = "BSD"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b3cb8d8f023026f3a1204ea334572c80"

SRC_URI = "file://myoctopus_${PV}.tar.gz"
SRC_URI[md5sum] = "207c2cd598cfff49573215c5b89c41b7"
SRC_URI[sha256sum] = "6dc3573f29e5087f4e50ba56d20e84c8c677b853bb3c17e91e605cc29eaff563"

S = "${WORKDIR}/myoctopus_${PV}"

inherit setuptools

RDEPENDS_${PN} = "python-modules python-flask python-flask-socketio python-redis python-gevent redis python-flask-cors"
