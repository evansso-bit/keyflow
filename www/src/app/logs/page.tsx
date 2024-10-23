import DataTable from "../_components/real-time-logs/data-table"

export default function LogsPage() {
    return (
        <div className="container mx-auto lg:py-20 py-10 flex flex-col gap-4">
            <h1 className="~text-2xl/sm font-bold">Real-time Logs</h1>
            <DataTable />
        </div>
    )
}