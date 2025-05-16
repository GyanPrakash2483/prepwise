// app/signup/page.tsx
'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

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

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md rounded-2xl shadow-2xl">
                <CardContent className="p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Welcome Back</h1>
                    <p className="text-sm">Sign In to proceed</p>
                </div>
                <form className="space-y-4">
                    <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    {emailError && <p className='text-red-500 text-sm pl-2'>{emailError}</p>}

                    <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    {passwordError && <p className='text-red-500 text-sm pl-2'>{passwordError}</p>}
                    <br />
                    <Button className="w-full" onClick={async (e) => {
                        e.preventDefault()

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

                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        if(!emailRegex.test(email)) {
                            setEmailError('Not a valid Email.')
                            return
                        } else {
                            setEmailError('')
                        }

                        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/auth/login`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                email,
                                password
                            })
                        })

                        if(response.status == 400) {
                            alert("Client Invalidated")
                            return
                        }

                        if(response.status == 404) {
                            setEmailError("This account does not exist, check correctness of your email or try making a new account.")
                            return
                        } else {
                            setEmailError('')
                        }

                        if(response.status == 403) {
                            setShowError(true)
                            return
                        }

                        if(response.status == 401) {
                            setPasswordError('Incorrect Password')
                            return
                        }

                        if(response.status == 200) {
                            setShowSuccess(true)

                            const res = await response.json()
                            localStorage.setItem('session_token', res.session_token)

                            setTimeout(() => {
                                location.href = '/'
                            }, 3000)

                            return
                        }

                    }}>Sign In</Button>
                </form>
                <Separator />
                <p className="text-sm text-center text-gray-400">
                    Don&#39;t have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
                </p>
                </CardContent>
            </Card>

            <AlertDialog open={showError}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Error</AlertDialogTitle>
                        <AlertDialogDescription>Account is not verified.</AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
            
            <AlertDialog open={showSuccess}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Success</AlertDialogTitle>
                        <AlertDialogDescription>Logged In successfully. You will soon be redirected.</AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
