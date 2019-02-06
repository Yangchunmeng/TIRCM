// Loop through Array of Objects
var objPeople = [
	{ // Object @ 0 index
		username: "myclp",
		password: "myclp"
	},
	{ // Object @ 1 index
		username: "sy16401",
		password: "sy16401"
	},
	{ // Object @ 2 index
		username: "plant",
		password: "plant"
	}

]

function getInfo() {
	var username = document.getElementById('username').value
	var password = document.getElementById('password').value

	for(var i = 0; i < objPeople.length; i++) {
		// check is user input matches username and password of a current index of the objPeople array
		if(username == objPeople[i].username && password == objPeople[i].password) {
			//console.log(username + " is logged in!!!")
			// stop the function if this is found to be true
			return window.open ('TIRCM-SubstationList.html','_self',false);
		}
	}
	//console.log("incorrect username or password")
}