import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.loginuser.findUnique({
      where: { username },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        user_id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET
    );
    res.json({ token });
  } catch (e) {
    console.error("Error logging in user:", e);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default loginUser;
