import nodemailer from 'nodemailer'
import { configDotenv } from 'dotenv'

configDotenv()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.PREPWISE_EMAIL,
        pass: process.env.PREPWISE_EMAIL_APP_PASSWORD
    }
})

export default function sendEmail(recipient, subject, htmlBody) {
    const mailOptions = {
        from: process.env.PREPWISE_EMAIL,
        to: recipient,
        subject,
        html: htmlBody
    }

    transporter.sendMail(mailOptions)
}