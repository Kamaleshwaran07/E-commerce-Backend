import express from 'express'
import userController from '../Controllers/usercontroller.min.js'
import authToken from '../Middleware/auth.js'

const userRouter = express.Router()

userRouter.post('/signup', userController.signup)
userRouter.post('/login', userController.login)
userRouter.get('/logout', userController.logout)
userRouter.post('/edit-role', authToken.verifyToken, userController.editRoleDetails)
userRouter.delete('/delete-user/:userId', authToken.verifyToken, userController.deleteUser)
userRouter.post('/edit-profile', authToken.verifyToken, userController.editUserDetails)
userRouter.get('/getallusers',authToken.verifyToken, userController.getAllUsers)
userRouter.get('/getuser', authToken.verifyToken, userController.getUserDetails)






export default userRouter
