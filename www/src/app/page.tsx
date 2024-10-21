import { CreateApiKey } from "./_components/create-apiKey";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VerifyApiKey } from "./_components/verify-apiKey";
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-3 gap-6 flex flex-col">
      <div className="flex flex-col items-center gap-3 text-center lg:py-20  py-10">
        <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Keyflow</h1>
        <p className="text-xl mb-8 text-center">
          An open-source API key management system
        </p>
        <Button>
          <Link href="https://github.com/evansso-bit/keyflow-api">
            Github source code
          </Link>
        </Button>
      </div>
      <CreateApiKey />
      <VerifyApiKey />
    </div>
  );
}
