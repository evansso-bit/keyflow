export type Bindings = {
	UPSTASH_REDIS_REST_URL: string;
	UPSTASH_REDIS_REST_TOKEN: string;
	CONVEX_URL: string;
	ENVIRONMENT: "development" | "production";
	WORKFLOW_BASE_URL: string;
};

// Types for our API key schema
export type CreateKeyRequest = {
	apiId: string;
	prefix?: string;
	byteLength?: number;
	ownerId?: string;
	name?: string;
	meta?: Record<string, unknown>;
	expires?: number;
	ratelimit?: {
		type: "fast" | "consistent";
		limit: number;
		refillRate: number;
		refillInterval: number;
	};
	remaining?: number;
	refill?: {
		amount: number;
		interval: "daily" | "monthly";
	};
	enabled?: boolean;
};

export type CreateKeyResponse = {
	key: string;
	keyId: string;
};

export type VerifyKeyRequest = {
	key: string;
};

export type VerifyKeyResponse = {
	valid: boolean;
	ownerId?: string;
	meta?: Record<string, unknown>;
	expires?: number;
	ratelimit?: {
		limit: number;
		remaining: number;
		reset: number;
	};
};
