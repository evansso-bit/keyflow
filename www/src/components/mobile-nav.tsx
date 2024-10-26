'use client';

import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/config/utils'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Drawer } from 'vaul';
import { ArrowUpRight } from 'lucide-react';

export function MobileNav({ links }: { links: { label: string, href: string }[] }) {
    const pathname = usePathname();
    return (
        <div className='lg:hidden block'>
            <Drawer.Root direction="right">
                <Drawer.Trigger asChild>
                    <Button variant="outline" size="icon">
                        <MenuIcon className="w-4 h-4" />
                    </Button>
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                    <Drawer.Content
                        className="right-2 top-2 bottom-2 fixed z-10 outline-none w-[310px] bg-white dark:bg-[#08090A] rounded-lg flex"
                        // The gap between the edge of the screen and the drawer is 8px in this case.
                        style={{ '--initial-transform': 'calc(100% + 8px)' } as React.CSSProperties}
                    >
                        <div className="h-full w-full grow px-4 py-3 flex flex-col rounded-[16px]">
                            <div className="max-w-lg">
                                <Drawer.Title className="text-xl px-2 mb-5">Menu</Drawer.Title>
                                <Drawer.Trigger asChild>
                                    <div className='flex flex-col gap-3 mb-5'>
                                        {links.map((link, index) => (
                                            <Link key={index} href={link.href} className={cn('px-2 py-0.5 text-lg transition-colors duration-300', pathname === link.href ? 'dark:text-white text-black' : 'text-zinc-500 dark:text-zinc-400')}>{link.label}</Link>
                                        ))}
                                    </div>
                                </Drawer.Trigger>

                                <div className='flex flex-col gap-2'>
                                    <Drawer.Trigger asChild>
                                        <Link href="https://github.com/evansso-bit/keyflow" target='_blank' className='px-2 py-0.5 text-zinc-500 transition-colors duration-300 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 flex flex-row items-center gap-2'>
                                            GitHub <ArrowUpRight className='w-4 h-4' />
                                        </Link>
                                    </Drawer.Trigger>
                                    <Drawer.Trigger asChild>
                                        <Link href="https://x.com/evansso_" target='_blank' className='px-2 py-0.5 text-zinc-500 transition-colors duration-300 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 flex flex-row items-center gap-2'>
                                            Twitter <ArrowUpRight className='w-4 h-4' />
                                        </Link>
                                    </Drawer.Trigger>
                                </div>

                            </div>


                        </div>

                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        </div>
    );
}