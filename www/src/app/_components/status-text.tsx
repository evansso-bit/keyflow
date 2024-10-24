'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { AnimatedNumber } from '@/components/core/animated-number'
import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function StatusText() {
    const [isLoading, setIsLoading] = useState(true)
    const logs = useQuery(api.apiRequests.get)

    useEffect(() => {
        if (logs) {
            setIsLoading(false)
        }
    }, [logs])

    const totalKeys = logs?.filter((log) => log.request_body.key).length
    const totalRequests = logs?.length

    return (
        <p className="text-sm flex flex-row items-center text-muted-foreground">
            API Keys Generated- {isLoading ? <Skeleton className="w-4 h-4" /> :
                <AnimatedNumber springOptions={{
                    bounce: 0,
                    duration: 2000,
                }} value={totalKeys ?? 0} />},
            API Requests Made - {isLoading ? <Skeleton className="w-4 h-4" /> :
                <AnimatedNumber springOptions={{
                    bounce: 0,
                    duration: 2000,
                }} value={totalRequests ?? 0} />}
        </p>
    )
}
