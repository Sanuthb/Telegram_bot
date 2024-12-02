import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; 

    const user = await prisma.loginuser.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await prisma.loginuser.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default deleteUser;
