import express from 'express';
import addUser from '../Controllers/userController.js';
import loginUser from '../Controllers/authController.js';
import getusers from '../Controllers/getUsers.js';
import deleteUser from '../Controllers/deleteusers.js';

const userRouter = express.Router();

userRouter.post('/', addUser);
userRouter.post('/auth',loginUser)
userRouter.get('/getusers',getusers)
userRouter.delete('/deleteusers/:id',deleteUser)

export default userRouter;