import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
  try {
    console.log("Seeding Admin...");

    const adminData = {
      name: "HR Admin",
      email: "hr@admin.com",
      password: "admin123456",
      role: UserRole.ADMIN,
    };

    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingUser) {
      console.log("Admin already exists. Skipping seed.");
      return;
    }

    const response = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminData),
      }
    );

    const responseBody = await response.json();

    if (!response.ok) {
      console.error("Admin signup failed:", responseBody);
      return;
    }

    console.log("Admin created successfully");

    await prisma.user.update({
      where: { email: adminData.email },
      data: { emailVerified: true },
    });

    console.log("Admin email verified successfully");
  } catch (error) {
    console.error("Seed admin failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
