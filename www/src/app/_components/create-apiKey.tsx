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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    const [name, setName] = useState('');
    const [prefix, setPrefix] = useState('');
    const [expiration, setExpiration] = useState('');
    const [rateLimit, setRateLimit] = useState('');
    const [enableRateLimit, setEnableRateLimit] = useState(false);
    const [customData, setCustomData] = useState('');

    useEffect(() => {
        if (state && 'message' in state) {
            toast.success(state.message);
        } else {
            toast.error("Failed to create API key");
        }
    }, [state]);
    const formatCustomData = () => {
        try {
            const parsed = JSON.parse(customData);
            setCustomData(JSON.stringify(parsed, null, 2));
            toast.success("JSON formatted successfully");
        } catch (error) {
            toast.error("Invalid JSON");
        }
    };


    return (
        <Card className="lg:max-w-3xl w-full h-fit mx-auto">
            <CardHeader>
                <CardTitle>Create API Key</CardTitle>
                <CardDescription>
                    Create a new API key to use with the Keyflow API.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form action={formAction}>
                    <div className="flex flex-col lg:flex-row gap-3 items-center mb-4">
                        <div className="flex flex-row gap-3 h-fit w-full rounded-lg">
                            <div className="px-1 py-0.5 text-xs bg-gray-500 h-fit text-white rounded-md">POST</div>
                            <Separator orientation="vertical" />
                            <h1 className="text-sm w-fit">https://keys.mpesaflow.com/keys/create</h1>
                        </div>
                    </div>
                    <Tabs defaultValue="structured">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="structured">Structured Input</TabsTrigger>
                            <TabsTrigger value="custom">Custom Data</TabsTrigger>
                            <TabsTrigger value="example">Example Data</TabsTrigger>
                        </TabsList>
                        <TabsContent value="structured">
                            <div className="flex flex-col space-y-4 w-full">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter API key name"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="prefix">Prefix (optional)</Label>
                                    <Input
                                        id="prefix"
                                        name="prefix"
                                        value={prefix}
                                        onChange={(e) => setPrefix(e.target.value)}
                                        placeholder="key_live or key_test"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="expiration">Expiration (optional)</Label>
                                    <Input
                                        id="expiration"
                                        name="expiration"
                                        type="datetime-local"
                                        value={expiration}
                                        onChange={(e) => setExpiration(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="enable-rate-limit"
                                        checked={enableRateLimit}
                                        onCheckedChange={setEnableRateLimit}
                                    />
                                    <Label htmlFor="enable-rate-limit">Enable Rate Limit</Label>
                                </div>
                                {enableRateLimit && (
                                    <div>
                                        <Label htmlFor="rate-limit">Rate Limit (requests per minute)</Label>
                                        <Input
                                            id="rate-limit"
                                            name="rateLimit"
                                            type="number"
                                            value={rateLimit}
                                            onChange={(e) => setRateLimit(e.target.value)}
                                            placeholder="Enter rate limit"
                                            min="1"
                                        />
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="custom">
                            <div>
                                <Label htmlFor="custom-data">Custom Data (JSON format)</Label>
                                <div className="flex items-start space-x-2">
                                    <Textarea
                                        id="custom-data"
                                        name="customData"
                                        value={customData}
                                        onChange={(e) => setCustomData(e.target.value)}
                                        placeholder="Enter your custom JSON data here"
                                        rows={10}
                                        className="font-mono"
                                    />
                                    <Button type="button" variant="outline" size="sm" onClick={formatCustomData}>
                                        Format
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="example">
                            <div>
                                <Label htmlFor="example-data">Example Data</Label>
                                <Textarea
                                    id="example-data"
                                    name="exampleData"
                                    value={JSON.stringify(exampleData, null, 2)}
                                    readOnly
                                    rows={15}
                                    className="font-mono"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                    <Button size={'sm'} className="justify-start mt-5 w-fit" type="submit">Create API Key</Button>
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
