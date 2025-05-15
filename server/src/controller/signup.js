import { isValidEmail } from '../util/commonUtils.js'
import crypto from 'node:crypto'
import sendEmail from '../util/email.js'
import { configDotenv } from 'dotenv'
import prisma from '../util/db.js'

configDotenv()


export default async function signupController(req, res) {
    try {
        const {name, email, password} = req.body

        if(!name || !email) {
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

        sendEmail(email, 'Welcome to Prepwise - Verify Your Account',
            `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #2c3e50;">Thanks for signing up for Prepwise!</h2>
                    <p>Hi there,</p>
                    <p>We're excited to have you on board. Prepwise is your smart companion for test prep, productivity, and beyond.</p>
                    <p>Please verify your email address to activate your account:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationURL}"
                            style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Verify My Account
                        </a>
                        <br />
                        <br />
                    </div>
                    <p>If you didn't sign up for Prepwise, you can safely ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #888;">Need help? Just reply to this message or contact us at prepwise.gpsj@gmail.com</p>
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