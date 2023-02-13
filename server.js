const express = require("express");
const request = require("request");
const dotenv = require("dotenv");
const cors = require("cors"); // Calling cors dependency.
const corsOptions = require("./config/corsOptions"); // Calling corsOptions

dotenv.config();

const app = express();
const port = process.env.PORT || 3501;

app.use(cors(corsOptions));

app.listen(port, () => {
	console.log(`API is running on port ${port}`);
});

// Home Path
app.get("/", (req, res) => {
	res.send("Hello Earth");
});

app.get("/api/user/:identifier", (req, res) => {
	const identifier = req.params.identifier;
	let apiUrl;
	if (identifier.includes("-")) {
		apiUrl = `https://sessionserver.mojang.com/session/minecraft/profile/${identifier}`;
	} else {
		apiUrl = `https://api.mojang.com/users/profiles/minecraft/${identifier}`;
	}

	request(apiUrl, (error, response, body) => {
		if (!error && response.statusCode === 200) {
			const json = JSON.parse(body);
			const uuid = json.id ? json.id : identifier;
			const formattedUuid =
				uuid.slice(0, 8) +
				"-" +
				uuid.slice(8, 12) +
				"-" +
				uuid.slice(12, 16) +
				"-" +
				uuid.slice(16, 20) +
				"-" +
				uuid.slice(20);
			const skinUrl = `https://mc-heads.net/avatar/${uuid}`;
			const skinUrlBody = `https://mc-heads.net/body/${uuid}`;
			res.send({
				uuid: uuid,
				formatted_uuid: formattedUuid,
				username: json.name,
				skin_url: skinUrl,
				skin_body: skinUrlBody,
			});
		} else {
			res.status(404).send({ error: `User "${identifier}" not found` });
		}
	});
});
