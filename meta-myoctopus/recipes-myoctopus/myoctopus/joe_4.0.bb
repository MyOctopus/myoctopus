SUMMARY = "Joe's Own Editor"
DESCRIPTION = "JOE is a full featured terminal-based screen editor which is distributed under the GNU General Public License (GPL)."
HOMEPAGE = "http://joe-editor.sourceforge.net"
DEPENDS = "python-native mercurial-native"

LICENSE     = "GPL-3"
LIC_FILES_CHKSUM = "file://COPYING;md5=b234ee4d69f5fce4486a80fdaf4a4263"

SRC_URI = "hg://hg.code.sf.net/p/joe-editor;protocol=http;tag=joe-${PV};module=mercurial"

S = "${WORKDIR}/mercurial"

inherit autotools pkgconfig
