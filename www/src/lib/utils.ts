import { clsx, type ClassValue } from "clsx";
import { withFluid } from "@fluid-tailwind/tailwind-merge";
import { extendTailwindMerge } from "tailwind-merge";

const fluidMerge = extendTailwindMerge(withFluid);

export function cn(...inputs: ClassValue[] | any) {
	return fluidMerge(clsx(inputs));
}
