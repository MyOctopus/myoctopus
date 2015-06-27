SUMMARY = "A microframework based on Werkzeug, Jinja2 and good intentions"
LICENSE = "BSD"
LIC_FILES_CHKSUM = "file://LICENSE;md5=79aa8b7bc4f781210d6b5c06d6424cb0"
SRC_URI = "https://pypi.python.org/packages/source/F/Flask/Flask-${PV}.tar.gz"
SRC_URI[md5sum] = "378670fe456957eb3c27ddaef60b2b24"
S = "${WORKDIR}/Flask-${PV}"
inherit setuptools
RDEPENDS_${PN} = "python-werkzeug python-jinja2 python-itsdangerous"
