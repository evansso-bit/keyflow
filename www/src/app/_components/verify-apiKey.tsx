"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner";
import { useActionState, useEffect } from "react";
import { verifyApiKeyAction } from "@/actions/verify-apiKey";




export function VerifyApiKey() {
    const [state, formAction, pending] = useActionState(verifyApiKeyAction, null);


    useEffect(() => {
        if (!state) return
        if ("message" in state) {
            toast(state.message)
        } else {
            toast.error("state.error")
        }
    }, [state])


    return (
        <Card className="max-w-3xl w-full mx-auto">
            <CardHeader>
                <CardTitle>Verify API Key</CardTitle>
                <CardDescription>
                    Verify an API key to use with the Keyflow API.
                </CardDescription>

            </CardHeader>

            <CardContent>
                <form action={formAction}>

                    <div className="flex flex-row gap-3 h-fit rounded-lg">
                        <div className="px-1 h-fit py-0.5 bg-gray-500 text-white rounded">
                            POST
                        </div>
                        <div className="w-[3px] bg-gray-500 h-full" />
                        <Input
                            value={"https://keys.mpesaflow.com/keys/verify"}
                            readOnly
                            className=" border-none w-fit "
                        />



                    </div>


                    <Label htmlFor="custom-data">API Key</Label>
                    <Input
                        id="custom-data"
                        name="key"


                        placeholder="Enter your API key here"

                    />
                    <Button disabled={pending} size={'sm'} className="justify-start mt-5 w-fit" type="submit">
                        {pending ? "Verifying..." : "Verify API Key"}
                    </Button>



                </form>
            </CardContent>
            <CardFooter className="">
                {pending ? (
                    <pre className="bg-gray-100 p-4 rounded overflow-auto w-full text-center">
                        <Skeleton className="w-full h-20" />
                    </pre>
                ) : (
                    <pre className="px-10 border-dashed border-2 border-gray-500 rounded overflow-auto w-full  py-20">
                        {state?.data.length === 0 || !state?.data ? "Results will be shown here" : JSON.stringify(state?.data, null, 2)}
                    </pre>
                )}
            </CardFooter>
        </Card>
    );
}
