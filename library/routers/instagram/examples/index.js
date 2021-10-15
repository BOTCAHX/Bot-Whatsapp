const Instagram = require("../");

(async () => {
	// Create Client Instagram
	const insta = new Instagram("Username Example", "Paswords")

	// set Locations Sessions
	insta.PathSessions = "./session.json"

	// Set True
	await insta.Login(true);

	// Actions
	await insta.Follow("rayyreall")
})()