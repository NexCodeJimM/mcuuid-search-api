const request = require("request");

function getUserData(identifier, sessionApiUrl, mojangApiUrl) {
	let apiUrl;
	if (identifier.includes("-")) {
		apiUrl = `${sessionApiUrl}${identifier}`;
	} else {
		apiUrl = `${mojangApiUrl}${identifier}`;
	}

	return new Promise((resolve, reject) => {
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
				resolve({
					uuid: uuid,
					formatted_uuid: formattedUuid,
					username: json.name,
					skin_url: skinUrl,
					skin_body: skinUrlBody,
				});
			} else {
				reject(`User "${identifier}" not found`);
			}
		});
	});
}

module.exports = getUserData;
