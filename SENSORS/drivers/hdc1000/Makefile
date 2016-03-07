obj-m+=hdc1000.o
export ARCH:=x86
export CROSS_COMPILE:=i586-poky-linux-

all:
		make -C ../../edison-src/out/linux64/build/tmp/work/edison-poky-linux/linux-yocto/3.10.17-r0/linux-edison-standard-build M=$(PWD) modules
clean:
		make -C ../../edison-src/out/linux64/build/tmp/work/edison-poky-linux/linux-yocto/3.10.17-r0/linux-edison-standard-build M=$(PWD) clean
