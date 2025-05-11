import { getUserFromSessionToken } from "./util/commonUtils.js"
import prisma from "./util/db.js"

export function loggerMiddleware(req, res, next) {
    console.log(`[${req.ip}:${Date.now()}] - ${req.method} ${req.url}`)
    next()
}

export async function authMiddleware(req, res, next) {
    try {
        const sessionToken = req.headers['authorization'].split(' ')[1]

        if(!sessionToken) {
            return res.status(400).send("No session token provided")
        }

        const userInDB = await getUserFromSessionToken(sessionToken)

        if(!userInDB) {
            return res.status(401).send("Unauthorized")
        }

        req.user = userInDB

        next()

    } catch(err) {
        console.log(err)
        return res.status(500).send("Internal server error, please report this incident")
    }
}