import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
  try {
    const adminData = {
      name: "HR Admin",
      email: "hr@admin.com",
      password: "admin",
      role: UserRole.ADMIN,
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("Admin already exists");
    }

    const signUpAdmin = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });

    if(signUpAdmin.ok){
        await prisma.user.update({
          where: {
            email: adminData.email,
          },
          data: {
            emailVerified: true,
          },
        });
    }

  } catch (error) {
    console.log(error);
  }
}

seedAdmin();
