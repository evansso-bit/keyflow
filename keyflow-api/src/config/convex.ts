import { fetchWithErrorHandling } from "./ErrorHandlingFetch";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function convexMutation(url: string, path: string, args: any) {
	const result = await fetchWithErrorHandling(`${url}/api/mutation`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			path,
			args,
			format: "json",
		}),
	});

	if (result.status === "error") {
		throw new Error(`Convex mutation error: ${result.errorMessage}`);
	}
	return result.value;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function convexQuery(url: string, path: string, args: any) {
	const result = await fetchWithErrorHandling(`${url}/api/query`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			path,
			args,
			format: "json",
		}),
	});

	if (result.status === "error") {
		throw new Error(`Convex query error: ${result.errorMessage}`);
	}
	return result.value;
}
