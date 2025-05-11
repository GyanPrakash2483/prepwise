import prisma from './db.js'

export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}

export async function getUserFromSessionToken(sessionToken) {
    const user = await prisma.user.findFirst({
        where: {
            sessiontokens: {
                has: sessionToken
            }
        }
    })

    return user
}