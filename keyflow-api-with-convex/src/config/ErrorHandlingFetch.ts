export async function fetchWithErrorHandling(
	url: string,
	options: RequestInit
) {
	const { credentials, ...safeOptions } = options;

	const response = await fetch(url, safeOptions);
	const responseBody = await response.text();

	// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
	let parsedBody;
	try {
		parsedBody = JSON.parse(responseBody);
	} catch (e) {
		console.error("Failed to parse response as JSON:", responseBody);
		throw new Error("Invalid JSON response from server");
	}

	if (!response.ok) {
		console.error(`HTTP error! status: ${response.status}, body:`, parsedBody);

		// Check for the specific "transaction is being processed" error
		if (
			parsedBody.errorCode === "500.001.1001" &&
			parsedBody.errorMessage === "The transaction is being processed"
		) {
			return {
				status: "pending",
				message: "The transaction is being processed",
				...parsedBody,
			};
		}

		throw new Error(
			`HTTP error! status: ${response.status}, body: ${JSON.stringify(
				parsedBody
			)}`
		);
	}

	return parsedBody;
}
