import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../database";
import * as schema from "../database/schema";
import { sendEmail } from "./mail";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification
        }
    }),
    emailAndPassword: {
        enabled: true,
        async sendResetPassword({ user, url }) {
            await sendEmail({
                to: user.email,
                subject: "Reset Your Password",
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #2563eb;">Password Reset Request</h2>
                        <p>Hello ${user.name || 'there'},</p>
                        <p>We received a request to reset your password. Click the button below to proceed:</p>
                        <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
                        <p>If you didn't request this, you can safely ignore this email.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #666;">This link will expire in 1 hour.</p>
                    </div>
                `,
                text: `Reset your password: ${url}`
            });
        }
    },
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    // Send welcome email after successful registration
    async onSession(session) {
        if (session.user && !session.user.emailVerified) {
            // Send welcome email on first login
            try {
                await sendEmail({
                    to: session.user.email,
                    subject: "Welcome to TODO App! 🎉",
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #2563eb;">Welcome to TODO App!</h2>
                            <p>Hello ${session.user.name || 'there'},</p>
                            <p>Thank you for creating an account with us. You're all set to start managing your tasks!</p>
                            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="margin-top: 0; color: #1f2937;">Quick Start Guide:</h3>
                                <ul style="color: #4b5563;">
                                    <li>Create private tasks for your personal use</li>
                                    <li>Share public tasks with others</li>
                                    <li>Set deadlines and receive email reminders</li>
                                </ul>
                            </div>
                            <a href="${process.env.BETTER_AUTH_URL}/private-todo" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Get Started</a>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                            <p style="font-size: 12px; color: #666;">You're receiving this because you created an account on TODO App.</p>
                        </div>
                    `,
                    text: `Welcome to TODO App! Start managing your tasks at ${process.env.BETTER_AUTH_URL}/private-todo`
                });
            } catch (error) {
                console.error("Failed to send welcome email:", error);
            }
        }
    }
});
