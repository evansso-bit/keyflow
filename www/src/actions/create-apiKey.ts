"use server";

const exampleData = {
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

export async function createApiKey(prevState: any, formData: FormData) {
	try {
		let data;
		const customData = formData.get("customData");
		const exampleDataUsed = formData.get("exampleData");

		if (exampleDataUsed) {
			// Use example data
			data = exampleData;
		} else if (customData) {
			// Use custom data if provided
			data = JSON.parse(customData as string);
		} else {
			// Use structured data
			data = {
				name: formData.get("name"),
				prefix: formData.get("prefix") || undefined,
				expires:
					formData.get("expiration") ?
						new Date(formData.get("expiration") as string).getTime()
					:	undefined,
				ratelimit:
					formData.get("rateLimit") ?
						{
							type: "consistent",
							limit: parseInt(formData.get("rateLimit") as string, 10),
							refillRate: parseInt(formData.get("rateLimit") as string, 10),
							refillInterval: 60000, // 1 minute in milliseconds
						}
					:	undefined,
			};
		}

		const postData = await fetch("https://keys.mpesaflow.com/keys/create", {
			method: "POST",
			body: JSON.stringify(data),
		}).then((res) => res.json());

		return {
			data: postData,
			message: "API key created successfully",
		};
	} catch (error) {
		console.error(error);
		return {
			error: "Failed to create API key",
		};
	}
}
