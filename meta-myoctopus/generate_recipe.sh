#!/bin/bash

top_dir=$(dirname $(dirname $(readlink -f $0)))

echo $top_dir
source_dir=$top_dir/hostsoft
trimmed_source_dir=$(echo $source_dir | sed 's@^/\(.*\)$@\1@')
echo $trimmed_source_dir
dest_dir=$top_dir/meta-myoctopus/recipes-myoctopus/myoctopus/myoctopus
mkdir -p $dest_dir

folder_regex="s@$trimmed_source_dir@myoctopus_0.0.1@"
tar -czvf $dest_dir/myoctopus_0.0.1.tar.gz --transform "$folder_regex" $source_dir


