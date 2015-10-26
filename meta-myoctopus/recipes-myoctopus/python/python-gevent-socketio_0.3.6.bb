SUMMARY = "SocketIO server based on the Gevent pywsgi server, a Python network library"
LICENSE = "BSD"
LIC_FILES_CHKSUM = "file://LICENSE;md5=13484d110cf0f7e0713493cb09a8601c"
SRC_URI = "https://pypi.python.org/packages/source/g/gevent-socketio/gevent-socketio-${PV}.tar.gz"
SRC_URI[md5sum] = "33f745d74885366a07da516c000854b6"
S = "${WORKDIR}/gevent-socketio-${PV}"
inherit setuptools
RDEPENDS_${PN} = "python-gevent python-gevent-websocket"
