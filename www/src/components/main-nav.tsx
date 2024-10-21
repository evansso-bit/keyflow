'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { GithubIcon } from 'lucide-react'

export function MainNav() {
    const [stars, setStars] = useState(0)
    const [requests, setRequests] = useState(0)

    useEffect(() => {
        // Fetch GitHub stars
        fetch('https://api.github.com/repos/evansso-bit/keyflow')
            .then(res => res.json())
            .then(data => setStars(data.stargazers_count))

        // Fetch served requests (you'll need to implement this API)
        fetch('/api/stats/requests')
            .then(res => res.json())
            .then(data => setRequests(data.count))
    }, [])

    return (
        <header className="bg-background border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Keyflow</h1>
                <div className="flex items-center space-x-4">
                    <div className="text-sm">Served Requests: {requests.toLocaleString()}</div>
                    <Button asChild variant="outline" size="sm">
                        <a href="https://github.com/yourusername/keyflow" target="_blank" rel="noopener noreferrer">
                            <GithubIcon className="w-4 h-4 mr-2" />
                            Star on GitHub
                            <span className="ml-2 bg-primary/10 px-2 py-1 rounded-full text-xs">{stars}</span>
                        </a>
                    </Button>
                </div>
            </div>
        </header>
    )
}