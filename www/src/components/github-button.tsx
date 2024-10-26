import Link from "next/link";
import { GithubIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GithubButton() {
    return (
        <Button>
            <Link target="_blank" className="flex flex-row gap-2 items-center" href="https://dub.sh/keyflow">
                <GithubIcon className="size-3" />
                Star on GitHub
            </Link>
        </Button>
    )
}