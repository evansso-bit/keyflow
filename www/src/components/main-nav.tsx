'use client'


import { GithubIcon, TwitterIcon } from 'lucide-react'
import AnimatedBackground from '@/components/core/animated-background'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MobileNav } from '@/components/mobile-nav'
import { ThemeToggle } from '@/components/theme-toggle'

export function MainNav() {
    const pathname = usePathname()

    const links = [
        {
            label: "Create & Verify",
            href: "/",
        },
        {
            label: "Real-time Logs",
            href: "/logs",
        },
    ]



    return (
        <header className="bg-background border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Keyflow</h1>
                <div className='lg:flex flex-row hidden'>
                    <AnimatedBackground
                        defaultValue={links[0].label}
                        className='rounded-lg bg-zinc-100 dark:bg-zinc-800'
                        transition={{
                            type: 'spring',
                            bounce: 0.2,
                            duration: 0.3,
                        }}
                        enableHover
                    >
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                type='button'
                                className={cn('px-2 py-0.5 text-zinc-600 transition-colors duration-300 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50', pathname === link.href && 'bg-zinc-200 dark:bg-zinc-700')}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </AnimatedBackground>
                </div>

                <div className='flex flex-row gap-2'>
                    <Link target='_blank' className='hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors duration-300 lg:flex hidden' href="https://github.com/evansso-bit/keyflow">
                        <GithubIcon className="w-4 h-4" />
                    </Link>
                    <Link target='_blank' className='hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors duration-300 lg:flex hidden' href="https://x.com/evansso_bit">
                        <TwitterIcon className="w-4 h-4" />
                    </Link>
                    <ThemeToggle />
                    <MobileNav links={links} />
                </div>
            </div>
        </header>
    )
}