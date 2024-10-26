// Example data
import type { ApiKeyData } from "@/types/action-types";

export const exampleData: ApiKeyData = {
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
