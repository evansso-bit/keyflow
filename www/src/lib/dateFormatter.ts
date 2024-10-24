import { formatDistanceToNow, isYesterday, format, isValid } from "date-fns";

/**
 * Formats a date into a human-readable string
 * @param date - Date object, timestamp in milliseconds, or ISO date string
 * @returns Formatted date string
 */
export function formatDate(date: Date | number | string): string {
	const dateObj = date instanceof Date ? date : new Date(date);

	if (!isValid(dateObj)) {
		throw new Error("Invalid date provided");
	}

	const now = new Date();
	const diffInSeconds = (now.getTime() - dateObj.getTime()) / 1000;

	if (diffInSeconds < 60) {
		return "seconds ago";
	}

	if (diffInSeconds < 3600) {
		return formatDistanceToNow(dateObj, { addSuffix: true });
	}

	if (diffInSeconds < 86400) {
		const hours = Math.floor(diffInSeconds / 3600);
		return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	}

	if (isYesterday(dateObj)) {
		return "yesterday";
	}

	return format(dateObj, "MMMM d, yyyy");
}
