SUMMARY = "My Octopus host software"
LICENSE = "BSD"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b3cb8d8f023026f3a1204ea334572c80"

SRC_URI = "file://myoctopus_${PV}.tar.gz"
SRC_URI[md5sum] = "0ce39defe17e2886fadae0f1aef105ff"
SRC_URI[sha256sum] = "43d02e406d7e5d53cb7e2aeaa5e63d63e120e0a8d4531443899035fef2cff3be"

S = "${WORKDIR}/myoctopus_${PV}"

inherit setuptools

RDEPENDS_${PN} = "python-modules python-flask python-flask-socketio python-redis python-gevent redis"
