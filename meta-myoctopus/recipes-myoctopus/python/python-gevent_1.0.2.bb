SUMMARY = "Coroutine-based network library"
LICENSE = "UNKNOWN"
LIC_FILES_CHKSUM = "file://LICENSE;md5=2dbb33d00e1fd31c7041460a81ac0bd2"
SRC_URI = "https://pypi.python.org/packages/source/g/gevent/gevent-${PV}.tar.gz"
SRC_URI[md5sum] = "117f135d57ca7416203fba3720bf71c1"
S = "${WORKDIR}/gevent-${PV}"
inherit setuptools
RDEPENDS_${PN} = "python-greenlet"
