'use client'

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TreeNode, TreeNodeData } from "./components/TreeNode";
import { jsonrepair } from "jsonrepair";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ReactMarkdown from 'react-markdown'
import PrepwiseNavbar from "./components/PrepwiseNavbar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import Markdown from "react-markdown";

function UseIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < breakpoint);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, [breakpoint]);

  return isMobile;
}

export default function Home() {
  const [roadmap, setRoadmap] = useState('')
  const [topic, setTopic] = useState('')
  const [context, setContext] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [outOfCredits, setOutOfCredits] = useState(false)
  const [mobileDrawerOut, setMobileDrawerOut] = useState(false)

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

  const generateRoadmap = async (topic: string) => {
    setContext(topic)
    getDescription(topic)

    setRoadmap('')
    if (topic === '' || !topic) {
      return
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/roadmap?topic=${topic}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('session_token')}`
      }
    })

    setRefreshKey(prevKey => prevKey + 1)

    if (response.status === 401) {
      location.href = '/signin'
      return
    }

    if(response.status === 402) {
      setOutOfCredits(true)
      return
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder('utf-8')

    if (!reader) return

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })

      setRoadmap(prevRoadmap => prevRoadmap + chunk)
    }

  }

  let parsedRoadmapObject = {}
  try {
    const repairedJson = roadmap.replace('```\njson', '').replace('```json', '').replace('```', '')
    parsedRoadmapObject = JSON.parse(jsonrepair(repairedJson))

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // console.log(err)
  }

  const isMobile = UseIsMobile()

  const [AIDescription, setAIDescription] = useState('')

  const getDescription = async (topic: string) => {

    setAIDescription('')

    if(!isMobile) {
      document.getElementById('description_panel')?.scrollIntoView({
        behavior: 'smooth',
      })
    } else {
      setMobileDrawerOut(true)
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/aidescription?topic=${topic}&context=${context || 'General World'}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('session_token')}`
      }
    })

    const reader = response.body?.getReader()
    const decoder = new TextDecoder('utf-8')

    if (!reader) return

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })

      setAIDescription(prevAIDescription => prevAIDescription + chunk)

    }
  }

  return (
    <div>
      <PrepwiseNavbar key={refreshKey} />
      <div className="flex justify-center items-center gap-2 max-md:flex-col h-80">
        <Input className="w-80" type="text" placeholder="What do you wish to study?" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <Button onClick={() => {
          generateRoadmap(topic)
        }}> Generate Roadmap test </Button>
      </div>

      {
        roadmap &&
        <div>
          {
            isMobile
            ?
            <div>
              <TreeNode node={parsedRoadmapObject as TreeNodeData} clickHandler={getDescription} />
            </div>
            :
            <ResizablePanelGroup direction="horizontal" className="border">
            <ResizablePanel className="p-10">
              <TreeNode node={parsedRoadmapObject as TreeNodeData} clickHandler={getDescription} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel className="p-10" id="description_panel">
              <div>
                <ReactMarkdown components={{
                  h1: ({ ...props }) => <h1 className="text-3xl font-bold my-4" {...props} />,
                  h2: ({ ...props }) => <h2 className="text-2xl font-semibold my-3" {...props} />,
                  p: ({ ...props }) => <p className="my-2" {...props} />,
                  ul: ({ ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                  a: ({ ...props }) => <a className="text-blue-600 underline" target="_blank" rel="noopener" {...props} />,
                  // ...add more as needed
                }}>
                  {AIDescription}
                </ReactMarkdown>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
          }
          
        </div>
      }

      {
        <AlertDialog open={outOfCredits}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Out of credits
              </AlertDialogTitle>
              <AlertDialogDescription>
                Purchase more credits to continue using.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setOutOfCredits(false)
              }}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                location.href = '/credits'
              }}>Buy Credits</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }

      <Drawer open={mobileDrawerOut} onClose={() => {
        setMobileDrawerOut(false)
      }} >
        <DrawerContent>
          <DrawerHeader className="overflow-scroll">
            <DrawerTitle>
              More Info
            </DrawerTitle>
            <Markdown components={{
                h1: ({ ...props }) => <h1 className="text-3xl font-bold my-4" {...props} />,
                h2: ({ ...props }) => <h2 className="text-2xl font-semibold my-3" {...props} />,
                p: ({ ...props }) => <p className="my-2" {...props} />,
                ul: ({ ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                a: ({ ...props }) => <a className="text-blue-600 underline" target="_blank" rel="noopener" {...props} />,
                // ...add more as needed
            }}>
              {AIDescription}
            </Markdown>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
