const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const getUserData = require("./routes/getUserData");

dotenv.config();

const app = express();
const port = process.env.PORT || 3501;

app.use(cors(corsOptions));

app.listen(port, () => {
	console.log(`API is running on port ${port}`);
});

app.get("/", (req, res) => {
	res.send("Hello Earth");
});

app.get("/api/user/:identifier", async (req, res) => {
	const identifier = req.params.identifier;

	try {
		const userData = await getUserData(
			identifier,
			process.env.SESSION_API_URL,
			process.env.MOJANG_API_URL
		);
		res.send(userData);
	} catch (error) {
		res.status(404).send({ error });
	}
});
