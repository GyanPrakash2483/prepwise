import { getUserFromSessionToken } from "./util/commonUtils.js"
import { rateLimit } from 'express-rate-limit'

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

export const limiterMiddleware = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	limit: 120, // 60 req per minute
    message: 'Slow Down. You are being rate limited.',
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false,
    handler: () => {
        console.log('Server under heavy load.')
    }
})