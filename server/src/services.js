import cron from 'node-cron'
import prisma from './util/db.js';

const freeCreditAirdropTime = '30 25 2 * * 1'   // 02:25:30 every Monday, Arbitrary Time

cron.schedule(freeCreditAirdropTime, async () => {
    const result = await prisma.user.updateMany({
        where: {
            credits: {
                lt: 50,
            },
        },
        data: {
            credits: {
                increment: 50,
            },
        }
    });
    
    console.log(`Distributed free credits to ${result.count} users.`);
})