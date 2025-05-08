'use client'

import { useEffect, useState } from "react";
import { jsonrepair } from "jsonrepair";
import { TreeNode } from "./components/TreeNode";

export default function Home() {
  const [roadmap, setRoadmap] = useState('')
  
  useEffect(() => {
    (async() => {
      const response = await fetch('http://localhost:8080/api/generateroadmap?topic=DSA')
      const reader = response.body?.getReader()
      const decoder = new TextDecoder('utf-8')

      if(!reader) return

      while(true) {
        const {done, value} = await reader.read()
        if(done) break

        const chunk = decoder.decode(value, {stream: true})
        setRoadmap(roadmap => roadmap + chunk)
        setRoadmap(roadmap => roadmap.replace('```json', '').replace('```', ''))
      }

    })()

    
  }, [])

  let repairedRoadmap = '{}'
  try {
    repairedRoadmap = jsonrepair(roadmap)
  } catch {}

  return (
    <div className="flex justify-center text-black">
      <TreeNode node={JSON.parse(repairedRoadmap)} />
    </div>
  );
}
