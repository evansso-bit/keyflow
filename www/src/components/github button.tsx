'use client'

import Link from "next/link";
import { GithubIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function GithubButton() {
    const [stars, setStars] = useState(0);
    useEffect(() => {
        // Fetch GitHub stars
        fetch('https://api.github.com/repos/evansso-bit/keyflow')
            .then(res => res.json())
            .then(data => setStars(data.stargazers_count))
    }, [])
    return (
        <Button >
            <Link className="flex flex-row gap-2" href="https://github.com/evansso-bit/keyflow">

                <GithubIcon className="w-4 h-4" />
                Star on Github
                {stars}
            </Link>
        </Button>
    )
}