// No changes made here and no idea what it does
import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}

const prisma = global.prisma || new PrismaClient();

export default prisma;
