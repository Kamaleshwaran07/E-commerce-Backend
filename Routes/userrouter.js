import express from 'express'
import userController from '../Controllers/usercontroller.min.js'

const userRouter = express.Router()

userRouter.post('/signup', userController.signup)
userRouter.post('/login', userController.login)






export default userRouter
