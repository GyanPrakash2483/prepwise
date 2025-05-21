'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Moon, Sun, Wallet } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function PrepwiseNavbar() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [credits, setCredits] = useState(0)
    const [loggedIn, setLoggedIn] = useState(false)

    const [theme, setTheme] = useState<'light' | 'dark'>('dark')

    useEffect(() => {

        if(localStorage.getItem('theme') === 'dark') {
            setTheme('dark')
        } else if(localStorage.getItem('theme') === 'light') {
            setTheme('light')
        } else {
            const isDarkSchemePreferred = () => window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ?? false;
            if(isDarkSchemePreferred()) {
                setTheme('dark')
                localStorage.setItem('theme', 'dark')
            } else {
                setTheme('light')
                localStorage.setItem('theme', 'light')
            }
        }

        document.querySelector('html')?.classList.remove('dark')
        document.querySelector('html')?.classList.remove('light')
        document.querySelector('html')?.classList.add(theme)

    }, [theme])

    useEffect(() => {
        const session_token = localStorage.getItem('session_token') || ''

        const getUserData = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/user`, {
                headers: {
                    'Authorization': `Bearer ${session_token}`
                }
            })

            if(response.ok) {
                const userData = await response.json()
                setName(userData.name)
                setEmail(userData.email)
                setCredits(userData.credits)
            }
        }

        if(session_token) {
            setLoggedIn(true)
            getUserData()
        }
    }, [])

    

    return (
        <div className='flex justify-between items-center p-2 max-md:flex-col'>
            <Link href='/' className='max-md:hidden'>
                {
                    theme == 'dark'
                    ?
                    <Image src='/logo.png' alt='Prepwise logo' width={100} height={50} />
                    :
                    <Image src='/logo-black.png' alt='Prepwise logo' width={100} height={50} />
                }
            </Link>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                            <NavigationMenuLink href='/' className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] grid-cols-1 lg:grid-cols-[.75fr_1fr]'>
                                <div className='rounded-md px-4 py-3 transition-colors hover:bg-muted hover:shadow-sm flex justify-center items-center flex-col gap-5'>
                                    {
                                        theme == 'dark'
                                        ?
                                        <Image src='/logo.png' alt='Prepwise logo' width={100} height={50} />
                                        :
                                        <Image src='/logo-black.png' alt='Prepwise logo' width={100} height={50} />
                                    }
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
                            <NavigationMenuLink href='/credits' className={navigationMenuTriggerStyle()}>Credits</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href='/contact' className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div className=''>
                {
                    loggedIn
                    ?
                        <div className='flex items-center justify-center gap-4'>
                            <Button variant='outline' className='rounded-[200px]' onClick={() => {
                                localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark')
                                setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
                            }}>
                                {
                                    theme === 'dark'
                                    ?
                                        <Moon />
                                    :
                                        <Sun />
                                }
                            </Button>
                            <div className='flex gap-2'> <Wallet /> {credits} </div>
                            <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                                <SheetContent className='p-4'>
                                    <SheetTitle>
                                        {name}
                                    </SheetTitle>
                                    <SheetDescription>
                                        {email}
                                    </SheetDescription>
                                    <SheetHeader>
                                        <Button variant='secondary' onClick={() => {
                                            location.href = '/roadmaps'
                                        }}>Saved Roadmaps</Button>
                                        <Button variant='secondary' onClick={async () => {
                                            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/auth/logout`, {
                                                method: 'PATCH',
                                                headers: {
                                                    'Authorization': `Bearer: ${localStorage.getItem('session_token')}`
                                                }
                                            })
                                            localStorage.removeItem('session_token')

                                            setTimeout(() => {
                                                location.href = '/'
                                            }, 1000)
                                        }}>Logout</Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant='destructive'>Delete Account</Button>                                                
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Are you absolutely sure?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={async () => {
                                                        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/auth/deleteaccount`, {
                                                            method: 'DELETE',
                                                            headers: {
                                                                'Authorization': `Bearer ${localStorage.getItem('session_token')}`
                                                            }
                                                        })

                                                        localStorage.removeItem('session_token')

                                                        setTimeout(() => {
                                                            location.href = '/'
                                                        }, 3000)
                                                    }}>Delete Account</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </SheetHeader>
                                </SheetContent>
                            </Sheet>
                        </div>
                    :
                    <div className='flex items-center justify-center gap-8'>
                        <Button variant='outline' className='rounded-[200px]' onClick={() => {
                            localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark')
                            setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
                        }}>
                            {
                                theme === 'dark'
                                ?
                                    <Moon />
                                :
                                    <Sun />
                            }
                        </Button>
                        <Button onClick={() => {
                            location.href = '/signin'
                        }}>Sign In</Button>
                    </div>
                }
                
            </div>
        </div>
    )
}