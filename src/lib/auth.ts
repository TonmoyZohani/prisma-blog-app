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
    requireEmailVerification: true, 
  },
  
  emailVerification: {
    enabled: true, // ✅ Make sure it's enabled
    sendOnSignUp: true, // ✅ Send email on signup
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log("🔥 sendVerificationEmail called!");
      console.log("📧 To:", user.email);
      console.log("🔗 Verification URL:", url);
      console.log("🔑 Token:", token);

      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

      try {
        const info = await transporter.sendMail({
          from: '"Prisma Blog App" blog@gmail.com', // Use your actual email
          to:"tonmoyzohani@gmail.com", // ✅ Use the user's email, not hardcoded
          subject: "Verify Your Email",
          text: `Click here to verify: ${url}`,
          html: `<p>Click <a href="${url}">here</a> to verify your email</p>`,
        });

        console.log("✅ Message sent: %s", info.messageId);
      } catch (error) {
        console.error("❌ Email sending error:", error);
      }
    },
  },
});