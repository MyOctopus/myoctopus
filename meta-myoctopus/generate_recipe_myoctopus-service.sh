#!/bin/bash

top_dir=$(dirname $(dirname $(readlink -f $0)))

echo $top_dir
source_dir=$top_dir/hostsoft
trimmed_source_dir=$(echo $source_dir | sed 's@^/\(.*\)$@\1@')
echo $trimmed_source_dir
dest_dir=$top_dir/meta-myoctopus/recipes-myoctopus/myoctopus/myoctopus-service
mkdir -p $dest_dir

src_file=$source_dir/run.py
dest_file=$dest_dir/run.py

cp $src_file $dest_file

service_file=$dest_dir/myoctopus.service

md5run=$(md5sum  $dest_file | awk '{ print $1 }')
md5s=$(md5sum  $service_file | awk '{ print $1 }')
sha256s=$(sha256sum  $service_file | awk '{ print $1 }')

recipe_file=$top_dir/meta-myoctopus/recipes-myoctopus/myoctopus/myoctopus-service_$1.bb

cat > $recipe_file << EOM
SUMMARY = "My Octopus host software daemon"
LICENSE = "BSD"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b3cb8d8f023026f3a1204ea334572c80"

SYSTEMD_SERVICE_\${PN} = "myoctopus.service"

SRC_URI = "file://myoctopus.service"
SRC_URI += "file://run.py;md5=$md5run"
SRC_URI += "file://i2c_group.rules;md5=bfb3a5f127f707ecc56ab18f700ecdfb"
SRC_URI += "file://LICENSE"
SRC_URI[md5sum] = "$md5s"
SRC_URI[sha256sum] = "$sha256s"

S = "\${WORKDIR}"

inherit systemd useradd

USERADD_PACKAGES = "\${PN}"
USERADD_PARAM_\${PN} = "-u 1200 -g myoctopus -G i2c -d \${datadir}/myoctopus -r -s /bin/sh -P 'octopus' myoctopus"
GROUPADD_PARAM_\${PN} = "-g 900 myoctopus; -g 901 i2c"

do_install() {
        install -d -m 755 \${D}\${sysconfdir}/udev/rules.d
        install -d -m 755 \${D}\${datadir}/myoctopus
        install -m 644 \${WORKDIR}/i2c_group.rules \${D}\${sysconfdir}/udev/rules.d/i2c_group.rules
        install -d \${D}/\${systemd_unitdir}/system
        install -m 644 \${WORKDIR}/myoctopus.service \${D}/\${systemd_unitdir}/system
        install -p -m 644 run.py \${D}\${datadir}/myoctopus/
	      chown -R myoctopus \${D}\${datadir}/myoctopus
	      chgrp -R myoctopus \${D}\${datadir}/myoctopus
}

FILES_\${PN} = "\${base_libdir}/systemd/system/myoctopus.service"
FILES_\${PN} += "\${datadir}/myoctopus/*"
FILES_\${PN} += "\${sysconfdir}/udev/rules.d/i2c_group.rules"

RDEPENDS_\${PN} = "myoctopus udev"

EOM

echo "Done"
