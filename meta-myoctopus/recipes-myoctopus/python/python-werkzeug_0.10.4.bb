SUMMARY = "The Swiss Army knife of Python web development"
LICENSE = "BSD"
LIC_FILES_CHKSUM = "file://LICENSE;md5=a68f5361a2b2ca9fdf26b38aaecb6faa"
SRC_URI = "https://pypi.python.org/packages/source/W/Werkzeug/Werkzeug-${PV}.tar.gz"
SRC_URI[md5sum] = "66a488e0ac50a9ec326fe020b3083450"
S = "${WORKDIR}/Werkzeug-${PV}"
inherit setuptools
RDEPENDS_${PN} = ""
