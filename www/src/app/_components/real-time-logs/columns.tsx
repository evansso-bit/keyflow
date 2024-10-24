"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Dialog from "./dialog"
import { Id } from "../../../../convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/dateFormatter"

export type Logs = {
    method: string;
    statusCode: string;
    path: string;
    createdAt: string;
    id: Id<"api_requests">;
    request_body: any;
}

export const columns: ColumnDef<Logs>[] = [
    {
        header: "Method",
        accessorKey: "method",
        cell: ({ row }) => {
            return <Badge variant="outline" className={cn(
                "capitalize",
                row.original.method === "POST" ? "text-green-500" : "text-red-500"
            )}>{row.original.method}</Badge>
        }
    },
    {
        header: "Status Code",
        accessorKey: "statusCode",
        cell: ({ row }) => {
            return <p className={cn(
                "text-sm",
                parseInt(row.original.statusCode) >= 200 && parseInt(row.original.statusCode) < 300 ? "text-green-500" : "text-red-500"
            )}>{row.original.statusCode}</p>
        }
    },
    {
        header: "Path",
        accessorKey: "path",
    },
    {
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ row }) => {
            return <p className="text-sm">{formatDate(row.original.createdAt)}</p>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Dialog id={row.original.id} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
