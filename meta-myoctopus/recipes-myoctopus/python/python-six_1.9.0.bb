SUMMARY = "Python 2 and 3 compatibility utilities"
LICENSE = "MIT"
LIC_FILES_CHKSUM = "file://LICENSE;md5=6f00d4a50713fa859858dd9abaa35b21"
SRC_URI = "https://pypi.python.org/packages/source/s/six/six-${PV}.tar.gz"
SRC_URI[md5sum] = "476881ef4012262dfc8adc645ee786c4"
S = "${WORKDIR}/six-${PV}"
inherit setuptools
RDEPENDS_${PN} = ""
