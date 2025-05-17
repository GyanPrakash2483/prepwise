'use client'

import PrepwiseNavbar from "@/app/components/PrepwiseNavbar";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function FreeCreditReward(props: {
    amount: number
}) {
    return (
        <div className="flex flex-col w-[310px] items-center justify-center gap-12">
            <h2 className='text-xl'> Coming Soon... </h2>
            <p> Prepwise is currently under free trial. As for now, you can have your credits for free! :) </p>

            <Button onClick={async () => {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/credits/claimfree`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('session_token')}`
                    },
                    body: JSON.stringify({
                        amount: props.amount
                    })
                })

                if(response.ok) {
                    setTimeout(() => {
                        location.href = '/'
                    }, 3000)
                }

            }}>Get {props.amount} credits</Button>
        </div>
    )
}

export default function Checkout() {

    const searchParams = useSearchParams()

    const [amount, setAmount] = useState(0)

    useEffect(() => {
        setAmount(Number(searchParams.get('amount')) || 0)
    }, [searchParams])

    return (
        <>
            <PrepwiseNavbar />
            <div className='flex w-full mt-40 justify-center items-center'>
                <FreeCreditReward amount={amount} />
            </div>
        </>
    )
}