import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PrepwiseNavbar from "../components/PrepwiseNavbar";
import Image from "next/image";
import BuyCredits from "./buycredits";

export default function CreditsPage() {
    return (
        <div>
            <PrepwiseNavbar />
            <div className='flex justify-center items-center mt-18 p-4 max-md:flex-col gap-18'>
                <Card className="w-[350px] h-[700px]">
                    <CardHeader>
                        <CardTitle>Free Tier</CardTitle>
                        <CardDescription>Available to all users by default</CardDescription>
                        <Image alt="free tier" src="/free-tier.png" width={350} height={350} />
                    </CardHeader>
                    <CardContent>
                        <ul>
                            <li>
                                <h2 className='text-xl font-bold'>Free 150 Credits on Signup</h2>
                                <p className='text-sm pb-2'>Every new user receives 150 credits for free upon creating an account, allowing them to explore Prepwise’s features right away.</p>
                            </li>
                            <li>
                                <h2 className='text-xl font-bold'>Weekly Credit Refill</h2>
                                <p className='text-sm pb-2'>If a user&#39;s credit balance drops below 50, they automatically receive 50 additional credits at the start of each week.</p>
                            </li>
                            <li>
                                <h2 className='text-xl font-bold'>Always-On Access</h2>
                                <p className='text-sm pb-2'>This free credit system is available to all users by default, ensuring continuous, no-cost access to essential Prepwise features.</p>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="w-[350px] h-[700px]">
                <CardHeader>
                        <CardTitle>Paid</CardTitle>
                        <CardDescription>Fit for frequent users.</CardDescription>
                        <Image alt="paid tier" src="/paid-tier.png" width={350} height={350} />
                    </CardHeader>
                    <CardContent>
                        <ul>
                            <li>
                                <h2 className='text-xl font-bold'>Buy Additional Credits Anytime</h2>
                                <p className='text-sm pb-2'>purchase credits as needed, providing flexibility for higher usage or advanced features.</p>
                            </li>
                        </ul>

                        <BuyCredits />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}