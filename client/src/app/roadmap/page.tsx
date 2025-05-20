'use client'

import { useEffect, useState } from "react";
import PrepwiseNavbar from "../components/PrepwiseNavbar";
import { TreeNode, TreeNodeData } from "../components/TreeNode";
import { useSearchParams } from "next/navigation";

export default function Roadmap() {
    
    const [roadmap, setRoadmap] = useState<object | null>(null)
    const [roadmaptitle, setRoadmapTitle] = useState('')
    
    const nodeClickHandler = (topic: string) => {

    }

    const searchParams = useSearchParams()

    useEffect(() => {
        (async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/roadmap/${searchParams.get('id')}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('session_token')}`
                }
            })
            if(response.ok) {
                const data = await response.json()
                setRoadmap(JSON.parse(data.roadmap.roadmapObject))
                setRoadmapTitle(data.roadmap.title)
            }

        })()
    }, [])

    console.log(roadmap)

    return (
        <div>
            <PrepwiseNavbar />
            <div>
                {roadmap && <TreeNode node={roadmap as TreeNodeData} clickHandler={nodeClickHandler} />}
            </div>
        </div>
    )
}