import express from 'express'
import userController from '../Controllers/usercontroller.min.js'
import productController from '../Controllers/productcontroller.min.js'
import authToken from '../Middleware/auth.js'

const userRouter = express.Router()

userRouter.post('/signup', userController.signup)
userRouter.post('/login', userController.login)
userRouter.get('/logout', userController.logout)
userRouter.post('/edit-role', authToken.verifyToken, userController.editRoleDetails)
userRouter.post('/change-password', authToken.verifyToken, userController.changePassword)
userRouter.delete('/delete-user/:userId', authToken.verifyToken, userController.deleteUser)
userRouter.post('/edit-profile', authToken.verifyToken, userController.editUserDetails)
userRouter.get('/getallusers',authToken.verifyToken, userController.getAllUsers)
userRouter.get('/getuser', authToken.verifyToken, userController.getUserDetails)

// Product Router

userRouter.post('/create-product', authToken.verifyToken, productController.createProduct )
userRouter.get('/getallproducts', productController.getAllProducts)
userRouter.post('/edit-product/:productId', authToken.verifyToken, productController.editProductPrice)
userRouter.delete('/delete-product/:productId', authToken.verifyToken, productController.deleteProduct)
userRouter.get('/getAllCategories', productController.productCategory)
userRouter.get('/category/:category', productController.getCategoryWiseProducts)
userRouter.get('/subCategory/:subCategory', productController.getSubCategoryWiseProducts)
userRouter.get('/homeBanner/:subCategory', productController.getSubCategoryWiseProductsForBanner)
userRouter.get('/:category/:subCategory', productController.getSubcategoryProductsFromCategory)
userRouter.post('/productdetail/:productId', productController.getProductDetail)
userRouter.post('/cart/:productId', authToken.verifyToken, productController.addToCart)
userRouter.get('/cart', authToken.verifyToken, productController.getCartDetails)
userRouter.put('/cart/:cartId/:productId', authToken.verifyToken, productController.changeQuantity)
userRouter.post('/deleteprfrmcart', authToken.verifyToken, productController.removeFromCart)
userRouter.delete('/delcart', authToken.verifyToken, productController.deleteCart)

export default userRouter
