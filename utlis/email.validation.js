import nodemailer from 'nodemailer'

export async function sendEmail({ to, subject, html }) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASS
        }
    })

    const info = await transporter.sendMail({
        from: `'Job Search' <${process.env.SENDER_EMAIL}>`,
        to,
        subject,
        html
    })

    if (info.accepted.length > 0) return true
    return false
}