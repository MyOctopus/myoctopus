SUMMARY = "Implements a XML/HTML/XHTML Markup safe string for Python"
LICENSE = "BSD"
LIC_FILES_CHKSUM = "file://LICENSE;md5=c6d1adcf45d69359f256c1cea3254127"
SRC_URI = "https://pypi.python.org/packages/source/M/MarkupSafe/MarkupSafe-${PV}.tar.gz"
SRC_URI[md5sum] = "f5ab3deee4c37cd6a922fb81e730da6e"
S = "${WORKDIR}/MarkupSafe-${PV}"
inherit setuptools
RDEPENDS_${PN} = ""
