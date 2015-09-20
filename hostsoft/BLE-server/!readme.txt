1. Configure Edison:
	a.	Install bleno for nodejs
		npm install bleno
		
	b.	Install python-shell for nodejs
		npm install python-shell
        
    c.  Copy these files to the home folder
        setup_octopus.py
        setup_octopus.js
        setup_octopus.sh

    c.  Run sed -i -e 's/\r$//' setup_octopus.sh

    d.  Give the startup script execute permission
        chmod 755 setup_octopus.sh

2. Execute the startup script
    ./setup_octopus.sh

!!!! ----
2a. For now (the automatic setup func hasn't been finalized yet):
	in order for the app to work this needs to be done manually:
	- set up Edison wifi: configure_edison --wifi
	- make sure the wifi is connected before proceeding
!!!! ----

3. Execute the BLE server script
    node setup_octopus.js &

4. Execute the myoctopus server app
	python myoctopus_server.py &

5. Setup Edison using the mobile app

