import prisma from "../util/db.js"
import crypto from 'node:crypto'

export default async function loginController(req, res) {
    const { email, password } = req.body

    if(!email || !password) {
        return res.status(400).send("Bad Request")
    }

    const userInDB = await prisma.user.findFirst({
        where: {
            email
        }
    })

    if(!userInDB) {
        return res.status(404).send("Account does not exist.")
    }

    if(!userInDB.isverified) {
        return res.status(403).send("User not verified.")
    }

    const salt = userInDB.password.split('.')[0]
    const passwordHash = userInDB.password.split('.')[1]

    const userGivenPasswordHash = crypto.pbkdf2Sync(password, salt, 512, 512, 'sha512').toString('base64')

    if(userGivenPasswordHash !== passwordHash) {
        return res.status(403).send("Wrong Password")
    }

    // Authenticity Verified

    const newSessionToken = crypto.randomBytes(64).toString('base64url')

    const sessionTokenInserted = await prisma.user.update({
        where: {
            id: userInDB.id
        },
        data: {
            sessiontokens: {
                push: newSessionToken
            }
        }
    })

    if(!sessionTokenInserted) {
        throw new Error('Session token could not be inserted in DB')
    }

    res.status(200).send({
        session_token: newSessionToken
    })

}