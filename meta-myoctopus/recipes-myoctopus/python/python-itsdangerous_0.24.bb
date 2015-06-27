SUMMARY = "Various helpers to pass trusted data to untrusted environments and back."
LICENSE = "UNKNOWN"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b61841e2bf5f07884148e2a6f1bcab0c"
SRC_URI = "https://pypi.python.org/packages/source/i/itsdangerous/itsdangerous-${PV}.tar.gz"
SRC_URI[md5sum] = "a3d55aa79369aef5345c036a8a26307f"
S = "${WORKDIR}/itsdangerous-${PV}"
inherit setuptools
RDEPENDS_${PN} = ""
