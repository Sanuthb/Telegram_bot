import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const addUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (role !== "user" && role !== "superuser") {
      return res.status(400).json({ error: "Invalid role" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.loginuser.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to add user" });
    return;
  }
};

export default addUser;
