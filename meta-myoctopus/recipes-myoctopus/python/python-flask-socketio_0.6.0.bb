SUMMARY = "Socket.IO integration for Flask applications"
SRC_URI = "https://pypi.python.org/packages/source/F/Flask-SocketIO/Flask-SocketIO-0.6.0.tar.gz"
SRC_URI[md5sum] = "a990a0f63502f74be0d893cf142db7bf"
SRC_URI[sha256sum] = "5b004bc9a74421ec3983f5167a7cab70853b132a9c9c09d808c07f96bbf6ecd9"
#SRC_URI += "file://E"
LICENSE = "MIT"
#LIC_FILES_CHKSUM = "file://LICENSE;md5=fb40dde6b5294cda1545aba85442f5c2"
LIC_FILES_CHKSUM = "file://Flask_SocketIO.egg-info/PKG-INFO;md5=e1e599768cbb57e0d0489a40b8835b3d"
S = "${WORKDIR}/Flask-SocketIO-${PV}"
inherit setuptools
RDEPENDS_${PN} = "python-flask python-gevent python-gevent-socketio"

