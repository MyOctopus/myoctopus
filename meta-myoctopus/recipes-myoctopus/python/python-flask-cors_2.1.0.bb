SUMMARY = "A Flask extension adding a decorator for CORS support"
LICENSE = "MIT"
LIC_FILES_CHKSUM = "file://LICENSE;md5=e228ab79592c00d4942f8067b2894e99"
SRC_URI = "https://pypi.python.org/packages/source/F/Flask-Cors/Flask-Cors-${PV}.tar.gz"
SRC_URI[md5sum] = "dd8a83b98d86490e2b7d72ff4e07f970"
S = "${WORKDIR}/Flask-Cors-${PV}"
inherit setuptools
RDEPENDS_${PN} = "python-flask python-six"
