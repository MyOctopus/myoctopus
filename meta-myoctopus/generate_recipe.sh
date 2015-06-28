#!/bin/bash

top_dir=$(dirname $(dirname $(readlink -f $0)))

echo $top_dir
source_dir=$top_dir/hostsoft
trimmed_source_dir=$(echo $source_dir | sed 's@^/\(.*\)$@\1@')
echo $trimmed_source_dir
dest_dir=$top_dir/meta-myoctopus/recipes-myoctopus/myoctopus/myoctopus
mkdir -p $dest_dir

folder_regex="s@$trimmed_source_dir@myoctopus_$1@"
dest_file=$dest_dir/myoctopus_$1.tar.gz

tar -czvf $dest_file --transform "$folder_regex" $source_dir

md5s=$(md5sum  $dest_file | awk '{ print $1 }')
sha256s=$(sha256sum  $dest_file | awk '{ print $1 }')
#echo $md5s
#echo $sha256s

recipe_file=$top_dir/meta-myoctopus/recipes-myoctopus/myoctopus/myoctopus_$1.bb

cat > $recipe_file << EOM
SUMMARY = "My Octopus host software"
LICENSE = "BSD"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b3cb8d8f023026f3a1204ea334572c80"

SRC_URI = "file://myoctopus_\${PV}.tar.gz"
SRC_URI[md5sum] = "$md5s"
SRC_URI[sha256sum] = "$sha256s"

S = "\${WORKDIR}/myoctopus_\${PV}"

inherit setuptools

RDEPENDS_\${PN} = "python-modules python-flask"
EOM

echo "Done"
