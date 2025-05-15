import prisma from "../util/db.js"

export default async function logoutController(req, res) {

    const sessionToken = req.headers['authorization'].split(' ')[1]

    const userInDB = await prisma.user.findFirst({
        where: {
            id: req.user.id
        }
    })

    const updatedTokens = userInDB.sessiontokens.filter(token => token != sessionToken)

    const deleteSessionToken = await prisma.user.update({
        where: {
            id: req.user.id
        },
        data: {
            sessiontokens: updatedTokens
        }
    })

    if(deleteSessionToken) {
        return res.status(200).send('Logged Out')
    }

    return res.status(500).send('Internal Server Error, please report this incident.')

}