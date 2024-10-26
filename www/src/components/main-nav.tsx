'use client'


import { GithubIcon, TwitterIcon } from 'lucide-react'
import AnimatedBackground from '@/components/core/animated-background'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/config/utils'
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
                <Link href="/" className="text-xl font-calSans">Keyflow</Link>
                <div className='lg:flex flex-row gap-4 items-center hidden'>
                    <AnimatedBackground
                        defaultValue={pathname === links[0].href ? links[0].label : pathname === links[1].href ? links[1].label : links[0].label}
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
                                data-id={link.href}
                                className={cn('px-2 py-0.5  transition-colors duration-300', pathname === link.href ? 'dark:text-white text-black' : 'text-zinc-600 dark:text-zinc-400')}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </AnimatedBackground>
                </div>

                <div className='flex flex-row gap-2 lg:gap-6 items-center'>
                    <Link target='_blank' className='hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors duration-300 lg:flex hidden' href="https://github.com/evansso-bit/keyflow">
                        <GithubIcon className="h-[1.2rem] w-[1.2rem]" />
                    </Link>
                    <Link target='_blank' className='hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors duration-300 lg:flex hidden' href="https://x.com/evansso_">
                        <TwitterIcon className="h-[1.2rem] w-[1.2rem]" />
                    </Link>
                    <ThemeToggle />
                    <MobileNav links={links} />
                </div>
            </div>
        </header>
    )
}