// app/signup/page.tsx
'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import Script from "next/script"

declare global {
    interface Window {
        turnstile: {
            render: (selector: string, options: { sitekey: string, callback: (token: string) => void }) => void;
        };
    }
}

export default function SignUpPage() {

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

    const [turnstileToken, setTurnstileToken] = useState('')

    useEffect(() => {

        const showTurnstile = () => {
            window.turnstile.render('#cf-turnstile', {
                sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
                callback: (token: string) => {
                    setTurnstileToken(token)
                }
            })
        }

        const turnstileTimeout = setTimeout(() => {
            if(window.turnstile) {
                clearTimeout(turnstileTimeout)
                showTurnstile()
            }
        }, 100)
    }, [])

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    const [nameError, setNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [turnstileError, setTurnstileError] = useState('')

    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md rounded-2xl shadow-2xl">
                <CardContent className="p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Create your account</h1>
                    <p className="text-sm">Sign up to get started</p>
                </div>
                <Script type='text/javascript' src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit' async defer />
                <form className="space-y-4">
                    <Input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
                    {nameError && <p className='text-red-500 text-sm pl-2'>{nameError}</p>}

                    <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    {emailError && <p className='text-red-500 text-sm pl-2'>{emailError}</p>}

                    <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    {passwordError && <p className='text-red-500 text-sm pl-2'>{passwordError}</p>}

                    <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    {confirmPasswordError && <p className='text-red-500 text-sm pl-2'>{confirmPasswordError}</p>}

                    <br />
                    <div id='cf-turnstile' data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
                    {turnstileError && <p className='text-red-500 text-sm pl-2'>{turnstileError}</p>}

                    <Button className="w-full" onClick={async (e) => {
                        e.preventDefault()

                        if(!name) {
                            setNameError('Name is required.')
                            return
                        } else {
                            setNameError('')
                        }

                        if(!email) {
                            setEmailError('Email is required.')
                            return
                        } else {
                            setEmailError('')
                        }

                        if(!password) {
                            setPasswordError('Password is required.')
                            return
                        } else {
                            setPasswordError('')
                        }

                        if(password != confirmPassword) {
                            setConfirmPasswordError('Both Passwords need to be same')
                            return
                        } else {
                            setConfirmPasswordError('')
                        }

                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        if(!emailRegex.test(email)) {
                            setEmailError('Not a valid Email.')
                            return
                        } else {
                            setEmailError('')
                        }

                        if(!turnstileToken) {
                            setTurnstileError('Please complete robot verification. If it does not appear, refresh the page.')
                            return
                        } else {
                            setTurnstileError('')
                        }

                        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/auth/signup`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                name,
                                email,
                                password,
                                turnstileToken
                            })
                        })

                        if(response.status == 400) {
                            alert("Client Invalidated")
                            return
                        }

                        if(response.status == 409) {
                            setEmailError("This Email is already registered, try signing in instead.")
                            return
                        } else {
                            setEmailError('')
                        }

                        if(response.status == 500) {
                            setShowError(true)
                            return
                        }

                        if(response.status == 201) {
                            setShowSuccess(true)
                            return
                        }

                    }}>Create Account</Button>
                </form>
                <Separator />
                <p className="text-sm text-center text-gray-400">
                    Already have an account? <Link href="/signin" className="text-blue-500 hover:underline">Sign In</Link>
                </p>
                </CardContent>
            </Card>

            <AlertDialog open={showError}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Error</AlertDialogTitle>
                        <AlertDialogDescription>Unidentified Server Error, Please report this incident.</AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
            
            <AlertDialog open={showSuccess}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Success</AlertDialogTitle>
                        <AlertDialogDescription>Account created. Check your inbox to proceed.</AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
