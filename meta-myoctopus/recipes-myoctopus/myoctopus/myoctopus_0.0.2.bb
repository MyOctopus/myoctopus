SUMMARY = "My Octopus host software"
LICENSE = "BSD"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b3cb8d8f023026f3a1204ea334572c80"

SRC_URI = "file://myoctopus_${PV}.tar.gz"
SRC_URI[md5sum] = "e376c560227a1662baab6b1ca8fa7397"
SRC_URI[sha256sum] = "9d11008b94cf9e806b6b5fee7458a7f84f22540812fae4fc11a30b1c2b1069e5"

S = "${WORKDIR}/myoctopus_${PV}"

inherit setuptools

RDEPENDS_${PN} = "python-modules python-flask"
