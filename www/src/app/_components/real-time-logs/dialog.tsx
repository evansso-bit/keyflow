"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog as UIDialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"

export default function Dialog({ id, open, setOpen }: { id: Id<"api_requests">, open: boolean, setOpen: (open: boolean) => void }) {
    const selectedLog = useQuery(api.apiRequests.getById, { id })

    const handleCopyToClipboard = () => {
        if (selectedLog) {
            navigator.clipboard.writeText(JSON.stringify(selectedLog.responseData, null, 2))
            toast.success("Copied to clipboard")
        }
    }

    return (
        <UIDialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                    View API Log Details
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>API Log Details</DialogTitle>
                    <DialogDescription>
                        {selectedLog?.path} - {selectedLog?.statusCode}
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="request" className="border-b">
                    <TabsList>
                        <TabsTrigger value="request">Request</TabsTrigger>
                        <TabsTrigger value="response">Response</TabsTrigger>
                    </TabsList>
                    <TabsContent value="request">
                        <div className="grid gap-4 py-4">
                            <pre className="bg-muted p-4 rounded-md text-sm text-muted-foreground overflow-auto">
                                {selectedLog && JSON.stringify(selectedLog.requestData, null, 2)}
                            </pre>
                        </div>
                    </TabsContent>
                    <TabsContent value="response">
                        <div className="grid gap-4 py-4">
                            <pre className="bg-muted p-4 rounded-md text-sm text-muted-foreground overflow-auto">
                                {selectedLog && JSON.stringify(selectedLog.responseData, null, 2)}
                            </pre>
                        </div>
                    </TabsContent>
                </Tabs>
                <DialogFooter>
                    <Button onClick={handleCopyToClipboard}>Copy Response to Clipboard</Button>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </UIDialog>
    )
}