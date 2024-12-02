import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getusers = async(req,res) =>{
    try {
        const users = await prisma.loginuser.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}


export default getusers