SUMMARY = "Python client for Redis key-value store"
LICENSE = "MIT"
LIC_FILES_CHKSUM = "file://LICENSE;md5=51d9ad56299ab60ba7be65a621004f27"
SRC_URI = "https://pypi.python.org/packages/source/r/redis/redis-${PV}.tar.gz"
SRC_URI[md5sum] = "7619221ad0cbd124a5687458ea3f5289"
S = "${WORKDIR}/redis-${PV}"
inherit setuptools
RDEPENDS_${PN} = ""
