"use server";

import { formSchema } from "@/lib/zod";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function createApiKey(prevState: any, formData: FormData) {
	try {
		const data = Object.fromEntries(formData.entries());
		const parsed = formSchema.safeParse(data);

		if (!parsed.success) {
			return {
				success: false,
				error: parsed.error.flatten().fieldErrors,
			};
		}

		const postData = await fetch("https://keys.mpesaflow.com/keys/create", {
			method: "POST",
			body: JSON.stringify(parsed.data),
		}).then((res) => res.json());

		return {
			data: postData,
			message: "API key created successfully",
		};
	} catch (error) {
		console.error(error);
	}
}
