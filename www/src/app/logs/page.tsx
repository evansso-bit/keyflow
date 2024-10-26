import DataTable from "../_components/real-time-logs/data-table"
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Real-time Logs",
};

export default function LogsPage() {
    return (
        <div className="container mx-auto lg:py-20 py-10 lg:px-0 px-4 flex flex-col gap-4">
            <h1 className="lg:text-2xl text-xl">Real-time Logs</h1>
            <DataTable />
        </div>
    )
}