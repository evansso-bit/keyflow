"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { zfd } from "zod-form-data";
import type { ApiKeyData } from "@/types/action-types";
import { exampleData } from "@/lib/custom-data";

// Validation schema
const schema = zfd.formData({
	customData: zfd.text(z.string().optional()),
	exampleData: zfd.text(z.string().optional()),
	name: zfd.text(z.string().min(1).optional()),
	prefix: zfd.text(z.string().optional()),
	expiration: zfd.text(z.string().optional()),
	rateLimit: zfd.text(z.string().optional()),
});

// Action definition
export const createApiKeyAction = actionClient.schema(schema).stateAction<{
	data?: any;
	message?: string;
	error?: string;
}>(async ({ parsedInput }, { prevResult }) => {
	let data: ApiKeyData;

	if (parsedInput.exampleData) {
		// Use example data
		data = exampleData;
	} else if (parsedInput.customData) {
		// Use custom data if provided
		data = JSON.parse(parsedInput.customData);
	} else {
		// Use structured data
		data = {
			name: parsedInput.name!,
			prefix: parsedInput.prefix,
			expires:
				parsedInput.expiration ?
					new Date(parsedInput.expiration).getTime()
				:	undefined,
			ratelimit:
				parsedInput.rateLimit ?
					{
						type: "consistent",
						limit: parseInt(parsedInput.rateLimit, 10),
						refillRate: parseInt(parsedInput.rateLimit, 10),
						refillInterval: 60000, // 1 minute in milliseconds
					}
				:	undefined,
		};
	}

	const postData = await fetch("https://keys.mpesaflow.com/keys/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}).then((res) => res.json());

	return {
		data: postData,
		message: "API key created successfully",
	};
});
