"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner";
import { useActionState, useEffect, useState } from "react";
import { createApiKey } from "@/actions/create-apiKey";
import { CopyIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


const exampleData = {
    apiId: "api_123",
    prefix: "test",
    byteLength: 16,
    ownerId: "user_001",
    name: "Test Key 1",
    meta: {
        plan: "free",
        createdBy: "admin"
    },
    expires: 1735689600000,
    ratelimit: {
        type: "consistent",
        limit: 1000,
        refillRate: 10,
        refillInterval: 60000
    },
    remaining: 5000,
    refill: {
        amount: 5000,
        interval: "monthly"
    },
    enabled: true
};

export function CreateApiKey() {
    const [state, formAction, pending] = useActionState(createApiKey, null);
    const [useExampleData, setUseExampleData] = useState(false);
    const [customData, setCustomData] = useState('')

    useEffect(() => {
        if (!state) return
        if ("message" in state) {
            toast.success(state.message)
        } else {
            toast.error("Failed to create API key")
        }
    }, [state])


    return (
        <Card>
            <CardHeader>
                <CardTitle>Create API Key</CardTitle>
                <CardDescription>
                    Create a new API key to use with the Keyflow API.
                </CardDescription>
                <div className="flex flex-row gap-3  items-center">
                    <div className="flex flex-row gap-3 bg-black rounded-lg">
                        <Input
                            value={"https://keys.mpesaflow.com/keys/create"}
                            readOnly
                            className="bg-black w-fit"
                        />

                        <Button variant={"outline"} size={"icon"} onClick={async () => {
                            await navigator.clipboard.writeText("https://keys.mpesaflow.com/keys/create");
                            toast.success("URL copied to clipboard");

                        }}>
                            <CopyIcon className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex items-center mb-4">
                        <Label htmlFor="useExampleData" className="mr-2">Use Example Data</Label>
                        <Switch
                            id="use-example-data"
                            checked={useExampleData}
                            onCheckedChange={setUseExampleData}
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <form action={formAction}>

                    {useExampleData ? (
                        <pre className="bg-gray-100 p-4 rounded overflow-auto">
                            {JSON.stringify(exampleData, null, 2)}
                        </pre>
                    ) : (
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="custom-data">Custom Data (JSON format)</Label>
                            <Textarea
                                id="custom-data"
                                name="custom-data"
                                value={customData}
                                onChange={(e) => setCustomData(e.target.value)}
                                placeholder="Enter your custom JSON data here"
                                rows={10}
                            />
                        </div>
                    )}

                    <Button type="submit">Create API Key</Button>
                </form>
            </CardContent>
            <CardFooter>
                {pending ? (
                    <pre>
                        {"Creating API Key..."}
                    </pre>
                ) : (
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        {JSON.stringify(state?.data, null, 2)}
                    </pre>
                )}
            </CardFooter>
        </Card>
    );
}
