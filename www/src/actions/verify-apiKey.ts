"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
	key: zfd.text(z.string().min(1).max(20)),
});

export const verifApikeyAction = actionClient
	.schema(schema)
	.stateAction(async ({ parsedInput }) => {
		const response = await fetch(
			"https://keyflow-api.mpesaflow.com/keys/verify",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ key: parsedInput.key }), // Send as JSON object with key property
			}
		).then((res) => res.json());

		return {
			data: response,
			message: response.valid === false ? "Invalid API key" : "Valid API key",
		};
	});
