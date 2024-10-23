import { CreateApiKey } from "./_components/create-apiKey";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VerifyApiKey } from "./_components/verify-apiKey";
import { StatusText } from "./_components/status-text";
import { GithubButton } from "@/components/github button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-3 gap-6 flex flex-col">
      <div className="flex flex-col items-center gap-3 text-center lg:py-20  py-10 max-w-lg w-full mx-auto ">
        <h1 className="~text-4xl/lg text-center">Open Source API Key Generator</h1>
        <p className="mb-2 text-center">
          Open-source API key generation made simple. Build your own key management system without the complexity.
        </p>
        <div className="flex lg:flex-row flex-col w-full justify-center items-center gap-4 mb-6">
          <GithubButton />
          <Button variant='outline'>
            <Link href="/logs">View Real-time Logs</Link>
          </Button>
        </div>
        <StatusText />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <CreateApiKey />
        <VerifyApiKey />
      </div>

    </div>
  );
}
