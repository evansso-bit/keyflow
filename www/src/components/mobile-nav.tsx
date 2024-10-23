'use client';

import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Drawer } from 'vaul';
import { ArrowUpRight } from 'lucide-react';

export function MobileNav({ links }: { links: { label: string, href: string }[] }) {
    const pathname = usePathname();
    return (
        <div className='lg:hidden block'>
            <Drawer.Root direction="right">
                <Drawer.Trigger className="relative flex h-10 flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:hover:bg-[#1A1A19] dark:text-white">
                    <Button variant="ghost" size="icon">
                        <MenuIcon className="w-4 h-4" />
                    </Button>
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                    <Drawer.Content
                        className="right-2 top-2 bottom-2 fixed z-10 outline-none w-[310px] bg-white dark:bg-zinc-950 flex"
                        // The gap between the edge of the screen and the drawer is 8px in this case.
                        style={{ '--initial-transform': 'calc(100% + 8px)' } as React.CSSProperties}
                    >
                        <div className="h-full w-full grow p-3 flex flex-col rounded-[16px]">
                            <div className="max-w-lg mx-auto">
                                <Drawer.Title className="font-medium mb-2 text-zinc-900">Menu</Drawer.Title>
                                <div className='flex flex-col gap-3 mb-5'>
                                    {links.map((link, index) => (
                                        <Link key={index} href={link.href} className={cn('px-2 py-0.5 text-lg text-zinc-600 transition-colors duration-300 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50', pathname === link.href && 'text-white')}>{link.label}</Link>
                                    ))}
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Link href="https://github.com/evansso-bit/keyflow" target='_blank' className='px-2 py-0.5 text-zinc-600 transition-colors duration-300 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 flex flex-row items-center gap-2'>
                                        GitHub <ArrowUpRight className='w-4 h-4' />
                                    </Link>
                                    <Link href="https://x.com/evansso_bit" target='_blank' className='px-2 py-0.5 text-zinc-600 transition-colors duration-300 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 flex flex-row items-center gap-2'>
                                        Twitter <ArrowUpRight className='w-4 h-4' />
                                    </Link>
                                </div>

                            </div>


                        </div>

                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        </div>
    );
}