'use client'

import { useEffect, useState } from "react";
import PrepwiseNavbar from "../components/PrepwiseNavbar";
import { useSearchParams } from "next/navigation";
import Roadmap, { Roadmap_T } from "../components/Roadmap";

export default function RoadmapView() {
    
    const [roadmap, setRoadmap] = useState<object | null>(null)

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
                setRoadmap(data.roadmap)
            }

        })()
    }, [])

    return (
        <div>
            <PrepwiseNavbar />
            <div>
                {roadmap && <Roadmap roadmap={roadmap as Roadmap_T} />}
            </div>
        </div>
    )
}