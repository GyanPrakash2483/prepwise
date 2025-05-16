'use client'

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail } from "lucide-react"
import PrepwiseNavbar from "../components/PrepwiseNavbar"

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const generateMailtoLink = () => {
    const to = "prepwise.gpsj@gmail.com"
    const subject = encodeURIComponent(form.subject || "Contact from website")
    const body = encodeURIComponent(
      `Hi there,\n\n${form.message}\n\n— ${form.name} (${form.email})`
    )

    return `mailto:${to}?subject=${subject}&body=${body}`
  }

  useEffect(() => {
    if(localStorage.getItem('session_token')) {
        (async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/user`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('session_token')}`
                }
            })

            if(response.ok) {
                const user = await response.json()
                setForm({
                    name: user.name,
                    email: user.email,
                    subject: form.subject,
                    message: form.message
                })
            }

        })()
    }
  }, [])

  return (
    <div>
      <PrepwiseNavbar />
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-2xl rounded-2xl">
          <CardContent className="p-8 space-y-6 text-center">
            <h1 className="text-3xl font-bold">Get in Touch</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Fill out the form and click below to email us.
            </p>
            <div className="space-y-4 text-left">
              <Input
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Input
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
              />
              <Textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <a href={generateMailtoLink()} target="_blank" rel="noopener noreferrer">
              <Button className="w-full mt-4" size="lg" disabled={!form.email || !form.message}>
                <Mail className="mr-2 h-5 w-5" />
                Email Us
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
