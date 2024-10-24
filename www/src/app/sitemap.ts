import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: "https://keyflow.mpesaflow.com",
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: "https://keyflow.mpesaflow.com/logs",
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
	];
}
