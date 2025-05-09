import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import Image from 'next/image'
import Link from 'next/link'

export default function PrepwiseNavbar() {
    return (
        <div className='flex justify-between items-center p-2'>
            <Link href='/'>
                <Image src='/logo.png' alt='Prepwise logo' width={100} height={50} />
            </Link>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                                <div className='rounded-md px-4 py-3 transition-colors hover:bg-muted hover:shadow-sm flex justify-center items-center flex-col gap-5'>
                                    <Image src='/logo.png' alt='Prepwise logo' width={200} height={50} />
                                    <p className='text-sm leading-snug text-muted-foreground'>Your AI-powered study partner—get instant help, roadmap, summaries, and smart insights while you learn.</p>
                                </div>
                                <div>
                                    <div className='rounded-md px-4 py-3 transition-colors hover:bg-muted hover:shadow-sm'>
                                        <span className='text-sm font-medium leading-none'>Custom Study Roadmaps</span>
                                        <p className='text-sm leading-snug text-muted-foreground'>Automatically generate personalized study plans based on your goals, deadlines, and current knowledge level.</p>
                                    </div>
                                    <div className='rounded-md px-4 py-3 transition-colors hover:bg-muted hover:shadow-sm'>
                                        <span className='text-sm font-medium leading-none'>Instant Explanations</span>
                                        <p className='text-sm leading-snug text-muted-foreground'>Get clear, AI-generated explanations for any concept in seconds—no more endless searching.</p>
                                    </div>
                                    <div className='rounded-md px-4 py-3 transition-colors hover:bg-muted hover:shadow-sm'>
                                        <span className='text-sm font-medium leading-none'>24/7 AI Tutor</span>
                                        <p className='text-sm leading-snug text-muted-foreground'>Ask questions anytime and get instant, accurate support—no scheduling needed.</p>
                                    </div>
                                    <div className='rounded-md px-4 py-3 transition-colors hover:bg-muted hover:shadow-sm'>
                                        <span className='text-sm font-medium leading-none'>Powered by Google Gemini</span>
                                        <p className='text-sm leading-snug text-muted-foreground'>Leverages the advanced capabilities of Google Gemini AI to deliver fast, accurate, and intelligent study support.</p>
                                    </div>
                                </div>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                            <NavigationMenuLink href='/pricing' className={navigationMenuTriggerStyle()}>Pricing</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href='/contact' className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div>

            </div>
        </div>
    )
}