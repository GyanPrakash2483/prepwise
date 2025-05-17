'use client'

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function VerifyAccountPage() {

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

  const searchParams = useSearchParams()

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your account...')

  useEffect(() => {
    const email = searchParams.get('email')
    const token = searchParams.get('verificationtoken')

    if (!email || !token) {
      setStatus('error')
      setMessage('Invalid or missing verification link.')
      return
    }

    const verifyAccount = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/auth/verifyaccount`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            verificationToken: token
          })
        })

        if (res.ok) {
          setStatus('success')
          setMessage('Your account has been successfully verified!')
          setTimeout(() => location.href = '/signin', 3000)
        } else {
          const message = await res.text()
          setStatus('error')
          setMessage(message || 'Verification failed.')
        }
      } catch (err) {
        console.log(err)
        setStatus('error')
        setMessage('Something went wrong. Please try again later.')
      }
    }

    verifyAccount()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-2xl text-center p-8">
        <CardContent className="space-y-6">
          {status === 'loading' && (
            <>
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-500" />
              <p>{message}</p>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
              <p className="font-semibold">{message}</p>
              <p className="text-sm text-gray-400">Redirecting to sign in...</p>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="mx-auto h-10 w-10 text-red-500" />
              <p className="font-semibold">{message}</p>
              <p className="text-sm text-gray-400">
                Please contact support or request a new verification email.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
