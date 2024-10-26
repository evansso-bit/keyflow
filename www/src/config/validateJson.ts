import { toast } from "sonner";

export const validateJson = (
	jsonString: string,
	setJsonError: (error: string | null) => void
): boolean => {
	try {
		if (!jsonString.trim()) {
			setJsonError(null);
			return true;
		}

		// First try to parse it
		JSON.parse(jsonString);

		// Additional syntax checks
		const lines = jsonString.split("\n");
		let bracketCount = 0;
		let inString = false;
		let lastChar = "";

		for (let i = 0; i < jsonString.length; i++) {
			const char = jsonString[i];

			// Check for unescaped quotes
			if (char === '"' && lastChar !== "\\") {
				inString = !inString;
			}

			// Count brackets when not in string
			if (!inString) {
				if (char === "{") bracketCount++;
				if (char === "}") bracketCount--;
			}

			// Check for missing commas between properties
			if (!inString && char === '"' && i > 0) {
				let prevChar = jsonString[i - 1];
				while (prevChar === " " || prevChar === "\n") {
					i--;
					prevChar = jsonString[i - 1];
				}
				if (prevChar === "}" || prevChar === '"') {
					let foundComma = false;
					for (let j = i - 1; j >= 0; j--) {
						const c = jsonString[j];
						if (c === ",") {
							foundComma = true;
							break;
						}
						if (c !== " " && c !== "\n") break;
					}
					if (!foundComma) {
						setJsonError("Missing comma between properties");
						return false;
					}
				}
			}

			lastChar = char;
		}

		// Check for mismatched brackets
		if (bracketCount !== 0) {
			setJsonError("Mismatched curly braces");
			return false;
		}

		setJsonError(null);
		return true;
	} catch (error: any) {
		// Extract specific syntax error messages
		const errorMessage = error.message;
		if (errorMessage.includes("Unexpected end of JSON input")) {
			setJsonError("Incomplete JSON: Unexpected end of input");
		} else if (errorMessage.includes("Unexpected token")) {
			setJsonError("Syntax error: " + errorMessage);
		} else {
			setJsonError(errorMessage);
		}
		return false;
	}
};

export const formatCustomData = (
	customData: string,
	setCustomData: (data: string) => void,
	setJsonError: (error: string | null) => void
) => {
	try {
		const parsed = JSON.parse(customData);
		setCustomData(JSON.stringify(parsed, null, 2));
		setJsonError(null);
		toast.success("JSON formatted successfully");
	} catch (error) {
		toast.error("Invalid JSON");
	}
};
