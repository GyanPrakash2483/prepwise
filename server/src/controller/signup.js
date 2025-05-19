import { isValidEmail } from '../util/commonUtils.js'
import crypto from 'node:crypto'
import sendEmail from '../util/email.js'
import { configDotenv } from 'dotenv'
import prisma from '../util/db.js'

configDotenv()


export default async function signupController(req, res) {
    try {
        const {name, email, password, turnstileToken} = req.body

        if(!name || !email || !password || !turnstileToken) {
            return res.status(400).send("Bad Request")
        }

        const emailAlreadyRegistered = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if(emailAlreadyRegistered) {
            return res.status(409).send("Account with same Email already exists, try logging in instead.")
        }

        if(!isValidEmail(email)) {
            return res.status(400).send("Not a valid email")
        }

        // Robot verification
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                secret: process.env.TURNSTILE_SECRET,
                response: turnstileToken
            })
        })

        const outcome = await response.json()

        if(!outcome.success) {
            return res.status(400).send('Robot verification failed.')
        }

        // Genrerate Salt and Password Hash
        const salt = crypto.randomBytes(128).toString('base64')
        const password_hash = crypto.pbkdf2Sync(password, salt, 512, 512, 'sha512').toString('base64')

        const hashed_password_with_salt = `${salt}.${password_hash}`

        // Create Account
        const userInDB = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed_password_with_salt,
                credits: 150,
                isverified: false,
                sessiontokens: [],
                verificationtoken: crypto.randomBytes(16).toString('base64url'),
                roadmaps: []
            }
        })

        const verificationURL = encodeURI(`${process.env.FRONTEND_HOST}/verifyaccount?email=${email}&verificationtoken=${userInDB.verificationtoken}`)

        sendEmail(email, 'Welcome to Prepwise!',
            `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; color: #2c3e50;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="${process.env.FRONTEND_HOST}/logo-black.png" alt="Prepwise Logo" style="max-width: 150px; height: auto;" />
                    </div>
                    <h2>Welcome to Prepwise!</h2>
                    <p>Hello,</p>
                    <p>Thank you for signing up for Prepwise — your smart companion for test prep, productivity, and beyond.</p>
                    <p>To activate your account, please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationURL}" 
                        style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Verify My Account
                        </a>
                    </div>
                    <p>If the button above does not work, please copy and paste the following URL into your browser:</p>
                    <p style="word-break: break-word; font-size: 14px; color: #555;">${verificationURL}</p>
                    <p>If you did not create an account with Prepwise, you can safely ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #888;">
                        Need help? Reply to this email or contact us at <a href="${process.env.FRONTEND_HOST}/contact" style="color: #4CAF50;">${process.env.FRONTEND_HOST}/contact</a><br />
                        Visit us: <a href="${process.env.FRONTEND_HOST}" style="color: #4CAF50;">${process.env.FRONTEND_HOST}</a>
                    </p>
                </div>

            `
        )

        if(userInDB) {
            return res.status(201).send("Account created")
        }

        return res.status(500).send("Unknown server error, please report this incident.")
    } catch(err) {
        console.log(err)
        return res.status(500).send("Unknown server error, please report this incident.")
    }
}