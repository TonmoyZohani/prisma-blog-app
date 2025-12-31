import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

// First, verify your environment variables are loaded
console.log("🔍 Checking env vars:");
console.log("APP_USER exists:", !!process.env.APP_USER);
console.log("APP_URL exists:", !!process.env.APP_URL);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER!,
    pass: process.env.APP_PASS!,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  emailVerification: {
    enabled: true, 
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log("🔥 sendVerificationEmail called!");
      console.log("📧 To:", user.email);
      console.log("🔗 Verification URL:", url);
      console.log("🔑 Token:", token);

      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

      try {
        const info = await transporter.sendMail({
          from: '"Prisma Blog App" blog@gmail.com',
          to: user.email,
          subject: "Verify Your Email Address - Prisma Blog App",
          text: `Please verify your email by clicking: ${verificationUrl}`,
          html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e0e0e0; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">🔐 Verify Your Email</h1>
            <p style="margin-top: 10px; opacity: 0.9; font-size: 16px;">Welcome to Prisma Blog App!</p>
        </div>
        
        <div style="padding: 40px 30px;">
            <p style="margin-bottom: 20px; color: #555;">Hello,</p>
            <p style="margin-bottom: 20px; color: #555;">Thank you for signing up for <strong style="color: #333;">Prisma Blog App</strong>! We're excited to have you on board.</p>
            
            <p style="margin-bottom: 20px; color: #555;">To complete your registration and start exploring amazing content, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white !important; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">Verify Email Address</a>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffecb5; border-radius: 8px; padding: 15px; margin: 25px 0; color: #856404; font-size: 14px;">
                <span style="display: inline-block; margin-right: 8px;">⏰</span>
                <strong>Important:</strong> This verification link will expire in <strong>24 hours</strong>.
            </div>
            
            <p style="margin-bottom: 20px; color: #555;">If the button above doesn't work, you can copy and paste the following URL into your browser:</p>
            
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px dashed #dee2e6; word-break: break-all;">
                <a href="${verificationUrl}" style="font-family: 'Courier New', monospace; font-size: 14px; color: #667eea; text-decoration: none;">${verificationUrl}</a>
            </div>
            
            <p style="margin-bottom: 20px; color: #555;">
                <strong>Didn't create an account?</strong><br>
                If you didn't sign up for Prisma Blog App, you can safely ignore this email. Your email address won't be added to any lists.
            </p>
            
            <p style="margin-bottom: 20px; color: #555;">
                Need help or have questions?<br>
                Feel free to reply to this email or contact our support team.
            </p>
            
            <p style="margin-bottom: 20px; color: #555;">
                Best regards,<br>
                <strong>The Prisma Blog App Team</strong>
            </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; color: #6c757d; font-size: 14px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 8px 0;">© ${new Date().getFullYear()} Prisma Blog App. All rights reserved.</p>
            <p style="margin: 8px 0;">This email was sent to you as part of your Prisma Blog App registration.</p>
            
            <div style="margin-top: 20px;">
                <a href="${
                  process.env.APP_URL
                }" style="display: inline-block; margin: 0 12px; color: #6c757d; text-decoration: none;">🌐 Website</a>
                <a href="https://twitter.com" style="display: inline-block; margin: 0 12px; color: #6c757d; text-decoration: none;">🐦 Twitter</a>
                <a href="https://github.com" style="display: inline-block; margin: 0 12px; color: #6c757d; text-decoration: none;">🐙 GitHub</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                <em>If you're having trouble clicking the verification button, copy and paste the URL into your web browser.</em>
            </p>
        </div>
    </div>
</body>
</html>
    `,
          // Optional: Add headers for better email deliverability
          headers: {
            "X-Priority": "1",
            "X-MSMail-Priority": "High",
            Importance: "high",
          },
          priority: "high",
        });

        console.log("✅ Verification email sent to:", "tonmoyzohani@gmail.com");
        console.log("📧 Message ID:", info.messageId);
        console.log("🔗 Verification URL:", verificationUrl);
      } catch (error) {
        console.error("❌ Failed to send verification email:", error);
        // Don't throw the error here, just log it
        // Better Auth will handle the user experience
      }
    },
  },
});
