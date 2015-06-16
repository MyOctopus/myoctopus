angular.module('starter.services', [])

.factory('Light', function() {
	// Might use a resource here that returns a JSON array

	// Some fake testing data
	var actualGraduation = 0;
	if (localStorage.getItem("graduation") != null) {
		actualGraduation = localStorage.getItem("graduation");
		localStorage.setItem("graduation", actualGraduation)
	}

	return {
		isTurnedOn : function() {
			return (actualGraduation != 0);
		},
		switchLight : function() {
			if (actualGraduation != 0)
				actualGraduation = 0;
			else 
				actualGraduation = 100;
			this.save();
			return actualGraduation;
		},
		graduate : function(graduation) {
			actualGraduation = graduation;
			this.save();
			return actualGraduation;
		},
		getGraduation : function() {
			return actualGraduation;
		},
		turnOff : function() {
			actualGraduation = 0;
			this.save();
			return actualGraduation;
		},
		turnOn : function() {
			actualGraduation = 100;
			this.save();
			return actualGraduation;
		},
		save : function() {
			localStorage.setItem("graduation", actualGraduation)
		}
	};
});
