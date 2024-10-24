// Type definitions
interface RateLimit {
	type: "consistent";
	limit: number;
	refillRate: number;
	refillInterval: number;
}

export interface ApiKeyData {
	apiId?: string;
	prefix?: string;
	byteLength?: number;
	ownerId?: string;
	name: string;
	meta?: {
		plan?: string;
		createdBy?: string;
	};
	expires?: number;
	ratelimit?: RateLimit;
	remaining?: number;
	refill?: {
		amount: number;
		interval: string;
	};
	enabled?: boolean;
}
