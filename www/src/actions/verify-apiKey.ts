"use server";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function verifyApiKeyAction(prevState: any, formData: FormData) {
	try {
		const key = formData.get("key") as string;

		const formatedKey = JSON.stringify({
			key: key,
		});

		console.log(formatedKey);

		const response = await fetch("https://keys.mpesaflow.com/keys/verify", {
			method: "POST",
			body: formatedKey,
		}).then((res) => res.json());

		console.log(response);

		return {
			data: response,
			message: response.valid === false ? "Invalid API key" : "Valid API key",
		};
	} catch (error) {
		console.log(error);
		return {
			valid: false,
			error: `Error: ${error}`,
		};
	}
}
