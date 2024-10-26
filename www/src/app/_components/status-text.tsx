'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import NumberFlow from '@number-flow/react'
import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Key, Activity } from 'lucide-react'

export function StatusText() {
    const [isLoading, setIsLoading] = useState(true)

    const keys = useQuery(api.apiRequests.getByPath, {
        path: "/api/v1/keys"
    })
    const requests = useQuery(api.apiRequests.get)

    useEffect(() => {
        if (keys && requests) {
            setIsLoading(false)
        }
    }, [keys, requests])

    const totalKeys = keys?.filter((log) => log.response_body.key).length
    const totalRequests = requests?.length

    return (
        <div className="flex flex-col gap-2 text-center">
            <p>API Usage</p>
            <div className="flex flex-row gap-5">
                <div className="flex flex-row gap-2">
                    <Key className="w-4 h-4" />
                    <p className="text-sm flex flex-row gap-1 items-center text-muted-foreground">
                        {isLoading ? <Skeleton className="w-4 h-4" /> :
                            <NumberFlow trend="increasing" color='#00FF00' continuous={true} format={{ notation: 'compact' }} locales="en-US" value={totalKeys ?? 0} />} {" "} keys
                    </p>
                </div>
                <div className="flex flex-row gap-2">
                    <Activity className="w-4 h-4" />
                    <p className="text-sm flex flex-row gap-1 items-center text-muted-foreground">
                        {isLoading ? <Skeleton className="w-4 h-4" /> :
                            <NumberFlow trend="increasing" color='#00FF00' continuous={true} format={{ notation: 'compact' }} locales="en-US" value={totalRequests ?? 0} />} {" "} requests
                    </p>
                </div>
            </div>
        </div>

    )
}
