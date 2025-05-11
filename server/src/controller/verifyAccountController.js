import prisma from "../util/db.js"

export default async function verifyAccountController(req, res) {
    try {
        const { email, verificationToken } = req.body

        const userInDB = await prisma.user.findFirst({
            where: {
                email
            }
        }) 

        if(!userInDB) {
            return res.status(404).send("Account does not exist")
        }

        if(userInDB.verificationtoken !== verificationToken) {
            return res.status(401).send("Invalid verification token")
        }

        if(userInDB.isverified) {
            return res.status(409).send("Account is already verified")
        }

        //verify the account

        const accountVerified = await prisma.user.update({
            where: {
                id: userInDB.id
            },
            data: {
                isverified: true
            }
        })

        if(accountVerified) {
            return res.status(202).send("Account Verified")
        }

        return res.status(500).send("Unknown server error, please report this incident.")
    } catch(err) {
        console.log(err)
        return res.status(500).send("Unknown server error, please report this incident.")
    }
}