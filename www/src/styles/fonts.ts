import localFont from "next/font/local";
import { Inter } from "next/font/google";

export const CalSans = localFont({
	src: "./CalSans-SemiBold.ttf",
	weight: "400",
	style: "normal",
	variable: "--font-cal-sans",
});

export const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});
