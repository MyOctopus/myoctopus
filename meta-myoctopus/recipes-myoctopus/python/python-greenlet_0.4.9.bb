SUMMARY = "Lightweight in-process concurrent programming"
LICENSE = "MIT License"
LIC_FILES_CHKSUM = "file://LICENSE;md5=03143d7a1a9f5d8a0fee825f24ca9c36"
SRC_URI = "https://pypi.python.org/packages/source/g/greenlet/greenlet-${PV}.tar.gz"
SRC_URI[md5sum] = "00bb1822d8511cc85f052e89d1fd919b"
S = "${WORKDIR}/greenlet-${PV}"
inherit setuptools
RDEPENDS_${PN} = ""
