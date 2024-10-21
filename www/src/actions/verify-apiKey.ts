"use server";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function verifyApiKeyAction(prevState: any, formData: FormData) {
	try {
		const key = formData.get("key");

		const response = await fetch("https://keys.mpesaflow.com/keys/verify", {
			method: "POST",
			body: JSON.stringify({ key }),
		}).then((res) => res.json());

		return {
			data: response,
			message: response.valid === false ? "Invalid API key" : "Valid API key",
		};
	} catch (error) {
		return {
			valid: false,
			error: "An error occurred while verifying the API key",
		};
	}
}
