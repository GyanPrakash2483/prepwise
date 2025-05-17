import prisma from "../util/db.js";

export default async function claimFreeCredits(req, res) {
    try {
        if(!req.body.amount) {
            return res.status(500).send('Bad request')
        }

        const giveFreeCredits = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                credits: {
                    increment: req.body.amount
                }
            }
        })

        if(!giveFreeCredits) {
            throw new Error('Database operation failed.')
        }

        return res.status(200).send('Credits claimed successfully')
    } catch (err) {
        console.log(err)
        return res.status(500).send('Internal server error. Please report this incident.')
    }
}