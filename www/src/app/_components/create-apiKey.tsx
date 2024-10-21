"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner";
import { useActionState, useEffect, useState } from "react";
import { createApiKey } from "@/actions/create-apiKey";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@radix-ui/react-separator";


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
        <Card className="max-w-3xl w-full h-fit mx-auto">
            <CardHeader>
                <CardTitle>Create API Key</CardTitle>
                <CardDescription>
                    Create a new API key to use with the Keyflow API.
                </CardDescription>

            </CardHeader>

            <CardContent>
                <form action={formAction}>
                    <div className="flex flex-row gap-3  items-center">
                        <div className="flex flex-row gap-3 h-fit rounded-lg">
                            <div className="px-1 py-0.5 text-xs bg-gray-500 h-fit text-white rounded-md">POST</div>
                            <Separator orientation="vertical" />
                            <Input
                                value={"https://keys.mpesaflow.com/keys/create"}
                                readOnly
                                className=" border-none w-fit "
                            />

                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="useExampleData" className="mr-2">Use Example Data</Label>
                            <Switch
                                id="use-example-data"
                                checked={useExampleData}
                                onCheckedChange={setUseExampleData}
                            />
                        </div>
                    </div>
                    {useExampleData ? (
                        <pre className="bg-gray-100 p-4 h-[250px] overflow-y-auto rounded overflow-auto">
                            {JSON.stringify(exampleData, null, 2)}
                        </pre>
                    ) : (
                        <div className="flex flex-col space-y-1.5 w-full">
                            <Label htmlFor="custom-data">Custom Data (JSON format)</Label>
                            <Textarea
                                id="custom-data"
                                name="custom-data"
                                value={customData}
                                onChange={(e) => setCustomData(e.target.value)}
                                placeholder="Enter your custom JSON data here"
                                rows={10}
                            />
                            <Button size={'sm'} className="justify-start mt-5 w-fit" type="submit">Create API Key</Button>
                        </div>
                    )}


                </form>
            </CardContent>
            <CardFooter className="">
                {pending ? (
                    <pre className="bg-gray-100 p-4 rounded overflow-auto w-full text-center py-20">
                        {"Creating API Key..."}
                    </pre>
                ) : (
                    <pre className="px-10 border-dashed border-2 border-gray-300 rounded-lg overflow-auto w-full py-20">
                        {state?.data.length === 0 || !state?.data ? "Results will be shown here" : JSON.stringify(state?.data, null, 2)}
                    </pre>
                )}
            </CardFooter>
        </Card>
    );
}
