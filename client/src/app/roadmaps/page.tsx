'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PrepwiseNavbar from "../components/PrepwiseNavbar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface RoadmapCardProps {
    id: number
    title: string
    completePercentage: number
}

interface RoadmapData {
    id: number
    title: string
    progress: number
}

function RoadmapCard(props: RoadmapCardProps) {

    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)

    return (
        <div className='w-full flex justify-center items-center'>
            <Card className='w-full max-w-[400px]'>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>
                        {props.title}
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button variant='outline' onClick={() => {
                            location.href = `/roadmap?id=${props.id}`
                        }}>
                            <SquareArrowOutUpRight />
                        </Button>
                        <Button variant='destructive' onClick={() => {
                            setDeleteAlertOpen(true)
                        }}>
                            <Trash2 />
                        </Button>
                        
                    </div>
                </CardHeader>
                <CardContent>
                    <span className='text-sm'>Progress:</span>
                    <Progress value={props.completePercentage} />
                </CardContent>
            </Card>
            <AlertDialog open={deleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>Your roadmap on {props.title} with {props.completePercentage.toPrecision(3)}% completion will be deleted. </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setDeleteAlertOpen(false)
                        }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/roadmap/${props.id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('session_token')}`
                                }
                            })
                            if(!response.ok) {
                                console.log('Error')
                            }
                            setDeleteAlertOpen(false)
                            location.reload()
                        }}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default function Roadmaps() {

    const [roadmapList, setRoadmapList] = useState([])

    useEffect(() => {
        (async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/roadmaplist`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('session_token')}`
                }
            })

            if(response.ok) {
                const data = await response.json()
                setRoadmapList(data.roadmapList)
            }

        })()
    }, [])

    return (
        <div>
            <PrepwiseNavbar />
            <div className="flex flex-col justify-center items-center pt-8 w-full gap-6 pb-12 px-1">
                {
                    roadmapList.length > 0
                    ?
                    roadmapList.map((roadmapData: RoadmapData, index: number) => {
                        return (
                            <RoadmapCard id={roadmapData.id} title={roadmapData.title} completePercentage={roadmapData.progress} key={index} />
                        )
                    })
                    :
                    <Loader className="animate-spin" />
                }
            </div>
        </div>
    )
}