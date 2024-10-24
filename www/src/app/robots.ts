import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/, /logs",
		},
		sitemap: "https://keyflow.mpesaflow.com/sitemap.xml",
	};
}
