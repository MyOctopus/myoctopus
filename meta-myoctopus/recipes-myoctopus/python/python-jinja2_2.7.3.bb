SUMMARY = "A small but fast and easy to use stand-alone template engine written in pure python."
LICENSE = "BSD"
LIC_FILES_CHKSUM = "file://LICENSE;md5=20c831f91dd3bd486020f672ba2be386"
SRC_URI = "https://pypi.python.org/packages/source/J/Jinja2/Jinja2-${PV}.tar.gz"
SRC_URI[md5sum] = "b9dffd2f3b43d673802fe857c8445b1a"
S = "${WORKDIR}/Jinja2-${PV}"
inherit setuptools
RDEPENDS_${PN} = "python-markupsafe"
