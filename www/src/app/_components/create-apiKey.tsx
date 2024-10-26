"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStateAction } from "next-safe-action/stateful-hooks";
import { createApiKeyAction } from "@/actions/create-apiKey";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateJson, formatCustomData } from "@/config/validateJson";
import { exampleData } from "@/config/custom-data";

export function CreateApiKey() {
    const { execute, result, isPending } = useStateAction(createApiKeyAction);
    const [name, setName] = useState('');
    const [prefix, setPrefix] = useState('');
    const [expiration, setExpiration] = useState('');
    const [rateLimit, setRateLimit] = useState('');
    const [enableRateLimit, setEnableRateLimit] = useState(false);
    const [customData, setCustomData] = useState('');
    const [currentTab, setCurrentTab] = useState('structured');
    const [jsonError, setJsonError] = useState<string | null>(null);

    useEffect(() => {
        if (!result?.data) return;
        if (result.data?.message) {
            toast.success(result.data.message);
        } else if (result.serverError) {
            toast.error(result.serverError);
        }
    }, [result]);



    const handleSubmit = async (formData: FormData) => {
        if (currentTab === 'custom' && customData.trim()) {
            if (!validateJson(customData, setJsonError)) {
                return; // Prevent form submission if JSON is invalid
            }
        }
        execute(formData);
    };

    const handleTabChange = (value: string) => {
        setCurrentTab(value);
        setJsonError(null); // Clear any existing JSON errors when switching tabs
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
                <form action={handleSubmit}>

                    <div className="flex flex-row lg:gap-3 gap-1 w-full rounded-lg items-center mb-4">
                        <div className="px-1 lg:text-sm text-xs bg-gray-500 h-fit py-0.5 text-white rounded">
                            POST
                        </div>
                        <Separator orientation="vertical" />
                        <p className="lg:text-sm text-xs w-fit">
                            https://keyflow-api.mpesaflow.com/keys/create
                        </p>
                    </div>

                    <Tabs defaultValue="structured" onValueChange={handleTabChange}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="structured">
                                <p className="lg:text-sm text-xs">Structured Input</p>
                            </TabsTrigger>
                            <TabsTrigger value="custom">
                                <p className="lg:text-sm text-xs">Custom Data</p>
                            </TabsTrigger>
                            <TabsTrigger value="example">
                                <p className="lg:text-sm text-xs">Example Data</p>
                            </TabsTrigger>
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
                                    <span className="text-red-500 text-xs">{result?.validationErrors?.name?._errors}</span>
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
                                    <span className="text-red-500 text-xs">{result?.validationErrors?.prefix?._errors}</span>
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
                                    <span className="text-red-500 text-xs">{result?.validationErrors?.expiration?._errors}</span>
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
                                        <span className="text-red-500 text-xs">{result?.validationErrors?.rateLimit?._errors}</span>
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
                                        onChange={(e) => {
                                            setCustomData(e.target.value);
                                            validateJson(e.target.value, setJsonError);
                                        }}
                                        placeholder="Enter your custom JSON data here"
                                        rows={10}
                                        className="font-mono"
                                    />
                                    <span className="text-red-500 text-xs">{result?.validationErrors?.customData?._errors}</span>
                                    <Button type="button" variant="outline" size="sm" onClick={() => formatCustomData(customData, setCustomData, setJsonError)}>
                                        Format
                                    </Button>
                                </div>
                                {jsonError && (
                                    <Alert variant="destructive" className="mt-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            {jsonError}
                                        </AlertDescription>
                                    </Alert>
                                )}
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
                                <span className="text-red-500 text-xs">{result?.validationErrors?.exampleData?._errors}</span>
                            </div>
                        </TabsContent>
                    </Tabs>
                    <Button
                        size="sm"
                        className="justify-start mt-5 w-fit"
                        type="submit"
                        disabled={isPending || (currentTab === 'custom' && !!jsonError)}
                    >
                        {isPending ? "Creating..." : "Create API Key"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="px-10 font-mono py-20 border-dashed border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-auto w-full ">
                {isPending ? (
                    <p>
                        {"Creating API Key..."}
                    </p>
                ) : (
                    <pre>
                        {!result?.data ? "Results will be shown here" : JSON.stringify(result.data, null, 2)}
                    </pre>
                )}
            </CardFooter>
        </Card>
    );
}
