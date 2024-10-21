"use server";

import { formSchema } from "@/lib/zod";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function createApiKey(prevState: any, formData: FormData) {
	try {
		const data = {
			apiId: "api_123",
			prefix: "test",
			byteLength: 16,
			ownerId: "user_001",
			name: "Test Key 1",
			meta: {
				plan: "free",
				createdBy: "admin",
			},
			expires: 1735689600000,
			ratelimit: {
				type: "consistent",
				limit: 1000,
				refillRate: 10,
				refillInterval: 60000,
			},
			remaining: 5000,
			refill: {
				amount: 5000,
				interval: "monthly",
			},
			enabled: true,
		};

		const postData = await fetch(
			"https://mpesaflow-api-key-engine.marsappollo3.workers.dev/keys/create",
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		).then((res) => res.json());

		return {
			data: postData,
			message: "API key created successfully",
		};
	} catch (error) {
		console.error(error);
	}
}
