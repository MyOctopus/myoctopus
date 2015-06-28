SUMMARY = "My Octopus host software"
LICENSE = "BSD"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b3cb8d8f023026f3a1204ea334572c80"

SRC_URI = "file://myoctopus_${PV}.tar.gz"
SRC_URI[md5sum] = "b8080170ffa3240ac2929d1b646ac720"
SRC_URI[sha256sum] = "360fcd6eb2d305b247a894f32fa37958faa2dba2d3fdc4e5cb20a87c540ae13a"

S = "${WORKDIR}/myoctopus_${PV}"

inherit setuptools

RDEPENDS_${PN} = "python-modules python-flask"
