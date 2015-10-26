SUMMARY = "Websocket handler for the gevent pywsgi server, a Python network library"
LICENSE = "Copyright 2011-2013 Jeffrey Gelens jeffrey at noppo.pro"
LIC_FILES_CHKSUM = "file://LICENSE;md5=9b6d0dda2588c549e606f5b0acadeb1b"
SRC_URI = "https://pypi.python.org/packages/source/g/gevent-websocket/gevent-websocket-${PV}.tar.gz"
SRC_URI[md5sum] = "03a8473b9a61426b0ef6094319141389"
S = "${WORKDIR}/gevent-websocket-${PV}"
inherit setuptools
RDEPENDS_${PN} = "python-gevent"
