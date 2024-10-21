import { CreateApiKey } from "./_components/create-apiKey";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VerifyApiKey } from "./_components/verify-apiKey";



export default function Home() {
  return (
    <div className="container mx-auto px-4 py-3 gap-6 flex flex-col">
      <div className="flex flex-col items-center gap-3 text-center lg:py-20  py-10">
        <h1 className="text-4xl font-bold  text-center">Welcome to Keyflow</h1>
        <p className="lg:text-xl text-lg mb-2 text-center">
          An open-source API key management system
        </p>
        <Button>
          <Link className="lg:text-lg text-sm" href="https://github.com/evansso-bit/keyflow">
            Github source code
          </Link>
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <CreateApiKey />
        <VerifyApiKey />
      </div>

    </div>
  );
}
