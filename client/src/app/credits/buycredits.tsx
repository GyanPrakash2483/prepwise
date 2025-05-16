'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function BuyCredits() {
    const [credits, setCredits] = useState<number | "">("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Allow empty string to let user clear input
        if (value === "") {
        setCredits("");
        return;
        }

        // Allow only digits
        if (/^\d+$/.test(value)) {
        setCredits(Number(value));
        }
    };

    return (
        <div className='flex flex-col justify-around gap-2'>
            <h2 className='font-bold mb-2 mt-4'> Buy Credits </h2>
            <Input
                type="text"
                inputMode="numeric"
                placeholder="Number of credits to buy"
                value={credits}
                onChange={handleChange}
            />
            
            {
                credits && 
                <div className="flex flex-col gap-2 justify-between h-full">
                    <span className="flex justify-between items-center">
                        <span> ₹{credits / 10} </span>
                        <span className='text-sm'> @ ₹0.1/credit </span>
                    </span>
                    <Button>Buy</Button>
                </div>
            }

            
        </div>
    );
}
