'use client'

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TreeNode, TreeNodeData } from "./components/TreeNode";
import { jsonrepair } from "jsonrepair";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ReactMarkdown from 'react-markdown'

export default function Home() {
  const [roadmap, setRoadmap] = useState('')
  const [topic, setTopic] = useState('')
  const [context, setContext] = useState('')
  
  const generateRoadmap = async(topic: string) => {
    setContext(topic)
    if(topic === '' || !topic) {
      return
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/roadmap?topic=${topic}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('session_token')}`
      }
    })

    // console.log(response.body)
    const reader = response.body?.getReader()
    const decoder = new TextDecoder('utf-8')

    if(!reader) return

    while(true) {
      const {done, value} = await reader.read()
      if(done) break

      const chunk = decoder.decode(value, {stream: true})
      // console.log(chunk)
      setRoadmap(prevRoadmap => prevRoadmap + chunk)
      setRoadmap(prevRoadmap => prevRoadmap.replace('```\njson', '').replace('```json', '').replace('```', ''))
    }

  }

  let parsedRoadmapObject = {}
  try {
    parsedRoadmapObject = JSON.parse(jsonrepair(roadmap))

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch(err) {
    // console.log(err)
  }
  // console.log(roadmap)
  // console.log(parsedRoadmapObject)

  const [AIDescription, setAIDescription] = useState('')

  const getDescription = async(topic: string) => {
    console.log(topic, context)

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/aidescription?topic=${topic}&context=${context}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('session_token')}`
      }
    })

    const reader = response.body?.getReader()
    const decoder = new TextDecoder('utf-8')

    if(!reader) return

    setAIDescription('')

    while(true) {
      const {done, value} = await reader.read()
      if(done) break

      const chunk = decoder.decode(value, {stream: true})
      
      setAIDescription(prevAIDescription => prevAIDescription + chunk)

    }

    // setAIDescription('O')

  }

  return (
    <div>
      <div className="flex justify-center items-center gap-2 max-md:flex-col h-80">
        <Input className="w-80" type="text" placeholder="What do you wish to study?" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <Button onClick={() => {
          generateRoadmap(topic)
        }}> Generate Roadmap </Button>
      </div>

      {
        roadmap &&
        <div>
          <ResizablePanelGroup direction={window.innerWidth > 400 ? "horizontal": "vertical"} className="border md:min-w-[450px]">
            <ResizablePanel className="p-10">
              <TreeNode node={parsedRoadmapObject as TreeNodeData} clickHandler={getDescription} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel className="p-10">
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
        </div>
      }
    </div>
  )

    
  

  // let repairedRoadmap = '{}'
  // try {
  //   repairedRoadmap = jsonrepair(roadmap)
  // } catch {}

  // return (
  //   <div className="flex justify-center text-black">
  //     <TreeNode node={JSON.parse(repairedRoadmap)} />
  //   </div>
  // );
}
