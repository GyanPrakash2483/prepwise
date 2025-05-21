'use client'

import { useEffect, useState } from "react";
import { TreeNode, TreeNodeData } from "./TreeNode";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ReactMarkdown from "react-markdown";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

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

export interface Roadmap_T {
    roadmapTitle: string
    roadmapObject: TreeNodeData
    id: number
}

interface RoadmapProps {
    roadmap: Roadmap_T
}

const Roadmap = (props: RoadmapProps) => {

    const isMobile = UseIsMobile()
    const roadmap = props.roadmap

    useEffect(() => {
        nodeClickHandler(roadmap.roadmapTitle)
    }, [])

    const [AIDescription, setAIDescription] = useState('_')
    const [mobileDrawerOut, setMobileDrawerOut] = useState(false)
    const [rerenderKey, setRerenderKey] = useState(0)

    
    async function nodeClickHandler(topic: string) {

        setAIDescription('')

        if(!isMobile) {
            document.getElementById('description_panel')?.scrollIntoView({
                behavior: 'smooth',
            })
        } else {
            setMobileDrawerOut(true)
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/aidescription?topic=${topic}&context=${roadmap.roadmapTitle}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('session_token')}`
            }
        })

        const reader = response.body?.getReader()
        const decoder = new TextDecoder('utf-8')

        if(!reader) return

        while(true) {
            const {done, value} = await reader.read()
            if(done) break

            const chunk = decoder.decode(value, {
                stream: true
            })

            setAIDescription(prevAIDescription => prevAIDescription + chunk)
        }
    }

    function findAndChangeCompletionState(node: TreeNodeData, uuid: string) {
        if(node.uuid === uuid) {
            node.isCompleted = !node.isCompleted
        } else if(node.children) {
            for(const child of node.children) {
                findAndChangeCompletionState(child, uuid)
            }
        }
    }

    async function nodeOnRightClick(uuid: string) {
        findAndChangeCompletionState(roadmap.roadmapObject, uuid)
        setRerenderKey(prevRerenderKey => prevRerenderKey + 1)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/roadmap/${props.roadmap.id}/togglecompletion/${uuid}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('session_token')}`
            }
        })

        if(!response.ok) {
            console.log('Roadmap out of sync!')
        }
    }

    return (
        <div>
            {
            isMobile
            ?
            <div className="pr-3 mt-4">
                <TreeNode node={roadmap.roadmapObject as TreeNodeData} clickHandler={nodeClickHandler} rightClickHandler={nodeOnRightClick} key={rerenderKey} />
            </div>
            :
            <ResizablePanelGroup direction="horizontal" className="border">
            <ResizablePanel className="p-10">
                <TreeNode node={roadmap.roadmapObject as TreeNodeData} clickHandler={nodeClickHandler} rightClickHandler={nodeOnRightClick} key={rerenderKey} />
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

            <Drawer open={mobileDrawerOut} onClose={() => {
                setMobileDrawerOut(false)
                }} >
                <DrawerContent>
                    <DrawerHeader className="overflow-scroll">
                    <DrawerTitle>
                        More Info
                    </DrawerTitle>
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
                    </DrawerHeader>
                </DrawerContent>
            </Drawer>
    </div>
    )
    
}

export default Roadmap