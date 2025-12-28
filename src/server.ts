import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to data successfully...");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(`An error occurred while connecting to the database: ${err}`);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
