"use server";

import { formSchema } from "@/lib/zod";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function createApiKey(prevState: any, formData: FormData) {
	try {
		const customData = formData.get("custom-data");

		const postData = await fetch("https://keys.mpesaflow.com/keys/create", {
			method: "POST",
			body: JSON.stringify(customData),
		}).then((res) => res.json());

		return {
			data: postData,
			message: "API key created successfully",
		};
	} catch (error) {
		console.error(error);
	}
}
