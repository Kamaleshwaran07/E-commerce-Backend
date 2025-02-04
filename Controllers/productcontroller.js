import Cart from "../Models/cartmodel.min.js";
import Product from "../Models/productmodel.min.js";
import User from "../Models/usermodel.min.js";

const productController = {
  createProduct: async (req, res) => {
    const userId = req.userId;
    const {
      productName,
      productDescription,
      brandName,
      productPrice,
      // sellingPrice,
      productImage,
      discountPercentage,
      color,
      category,
    } = req.body;
    // console.log(productName);
    try {
      const user = await User.findById(userId);
      // console.log(user)
      if (!user) {
        return res.status(404).json({ message: "User doesn't exist" });
      }
      if (user.role !== "Admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const product = await new Product({
        productName,
        productDescription,
        brandName,
        category,
        productPrice,
        // sellingPrice,
        discountPercentage,
        color,
        productImage,
        userId: userId,
      });
      // console.log(product);
      await product.save();
      console.log("Product saved", product);
      res
        .status(200)
        .json({ message: "Product created successfully", product });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server Error in creating product", error });
    }
  },
  getAllProducts: async (req, res) => {
    // const userId = req.userId;

    try {
      const allProducts = await Product.find();
      res
        .status(200)
        .json({ message: "Successfully fetched the products", allProducts });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server Error in getting the products", error });
    }
  },
  editProductPrice: async (req, res) => {
    const userId = req.userId;
    const {
      productPrice,
      discountPercentage,
      productName,
      brandName,
      color,
      productDescription,
      subCategory,
      category,
    } = req.body;
    const { productId } = req.params;
    // console.log(productId);

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User doesn't exist" });
      }
      if (user.role !== "Admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product doesn't exist" });
      }
      const productUpdate = await Product.findByIdAndUpdate(productId, {
        productPrice,
        discountPercentage,
        brandName,
        productDescription,
        productName,
        color,
        subCategory,
        category,
      });
      await productUpdate.save();
      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server Error in editing product", error });
    }
  },
  deleteProduct: async (req, res) => {
    const userId = req.userId;
    const { productId } = req.params;
    // console.log(productId);
    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User doesn't exist" });
      }
      if (user.role !== "Admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const product = await Product.findById(productId);
      // console.log(product);

      if (!product) {
        return res.status(404).json({ message: "Product doesn't exist" });
      }
      const deleteProduct = await Product.findByIdAndDelete(productId);
      await deleteProduct.save();
      res
        .status(200)
        .json({ message: "Deleted the product successfully", deleteProduct });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server Error in deleting product", error });
    }
  },
  productCategory: async (req, res) => {
    try {
      const filterCategory = await Product.distinct("category");
      // console.log("FilterCategory", filterCategory);

      const distinctCategory = [];
      // console.log("DistinctCategory", distinctCategory);

      for (const category of filterCategory) {
        const productCategory = await Product.findOne({ category });
        // console.log("Product Category", productCategory)
        if (productCategory) {
          distinctCategory.push(productCategory);
        }
      }
      // console.log("DistinctCatefory", distinctCategory)
      res.status(200).json({
        message: "Successfully fetched the category",
        distinctCategory,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server Error in getting category", error });
    }
  },
  getCategoryWiseProducts: async (req, res) => {
    const { category } = req.params;
    // console.log(category);
    try {
      const categoryProducts = await Product.find({ category: category });
      // console.log(categoryProducts);
      res.status(200).json({
        message: "Successfully fetched category wise products",
        categoryProducts,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server Error in getting category wise products",
        error,
      });
    }
  },
  getSubCategoryWiseProducts: async (req, res) => {
    const { subCategory } = req.params;
    // console.log(subCategory);
    try {
      const subCategoryProducts = await Product.find({
        subCategory: subCategory,
      });
      // console.log("SubCategory Products", subCategoryProducts);
      res.status(200).json({
        message: "Successfully fetched products",
        subCategoryProducts,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server Error in getting the products", error });
    }
  },
  getSubCategoryWiseProductsForBanner: async (req, res) => {
    const { subCategory } = req.params;
    // console.log(subCategory);
    try {
      const subCategoryProducts = await Product.find({
        subCategory: subCategory,
      }).limit(10);
      // console.log("SubCategory Products", subCategoryProducts);
      res.status(200).json({
        message: "Successfully fetched products",
        subCategoryProducts,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server Error in getting the products", error });
    }
  },
  getSubcategoryProductsFromCategory: async (req, res) => {
    const { category, subCategory } = req.params;
    // console.log(category, subCategory);
    try {
      const categoryProducts = await Product.find({ category: category });
      // console.log(categoryProducts)
      const subCategoryProducts = await categoryProducts.filter(
        (products) => products.subCategory === subCategory
      );
      // console.log("SubCategory Products", subCategoryProducts)

      res.status(200).json({
        message: "Successfully fetched products",
        subCategoryProducts,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server Error in getting the products", error });
    }
  },
  getProductDetail: async (req, res) => {
    const { productId } = req.params;
    // console.log("ProductId", productId);
    try {
      const productDetail = await Product.findById({ _id: productId });
      // console.log(productDetail);
      res.status(200).json({
        message: "Successfully fetched the product details",
        productDetail,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server Error in getting the product details",
        error,
      });
    }
  },
  addToCart: async (req, res) => {
    const userId = req.userId;
    // console.log(userId);
    const { productId } = req.params;
    const { quantity } = req.body;
    // console.log("Quantity", quantity);
    // console.log("ProductId", productId);

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "No such user exists" });
      }
      // console.log(user)
      const productDet = await Product.findById({ _id: productId });
      // console.log(productDet);
      if (!productDet) {
        return res.status(404).json({ message: "No such product exists" });
      }
      const findUserInCart = await Cart.findOne({ userId });
      console.log(findUserInCart);
      if (findUserInCart) {
        findUserInCart.cart.push({
          productId,
          quantity: 1,
          productDetails: productDet,
        });

        await findUserInCart.save();
        return res.status(200).json({ message: "Cart Updated" });
      } else {
        const cartUpdate = await new Cart({
          cart: [
            { productDetails: productDet, productId: productId, quantity: 1 },
          ],
          userId: userId,
        });
        await cartUpdate.save();
        return res
          .status(200)
          .json({ message: "Added to the Cart", cartUpdate });
      }
    } catch (error) {
      res.status(500).json({ message: "Server Error in adding the cart" });
    }
  },
  getCartDetails: async (req, res) => {
    const userId = req.userId;
    try {
      const user = await Cart.findOne({ userId });
      // console.log(user);
      res.status(200).json({ message: "Success", user });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server Error in getting the cart Details", error });
    }
  },
  changeQuantity: async (req, res) => {
    const userId = req.userId;
    const { quantity } = req.body;
    const { cartId, productId } = req.params;
    // console.log(userId, cartId, quantity);
    try {
      let userInCart = await Cart.findOne({ userId: userId });
      // console.log(userInCart);
      const findCart = userInCart.cart.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (findCart !== -1) {
        userInCart.cart[findCart].quantity = quantity;
      } else {
        return res.status(400).json({ message: "No suct products" });
      }
      await userInCart.save();

      res.status(200).json({ message: "Quantity Updated", findCart });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server error in changing quantity", error });
    }
  },
  removeFromCart: async (req, res) => {
    const { cartId } = req.body;
    const userId = req.userId;
    // console.log(cartId, userId);
    try {
      const user = await Cart.findOne({ userId: userId });
      if (!user) {
        return res.status(400).json({ message: "No products in Cart" });
      }
      const remove = await Cart.findOneAndUpdate(
        { userId: userId },
        { $pull: { cart: { _id: cartId } } },
        { new: true }
      );
      res
        .status(200)
        .json({ message: "Successfully removed from cart", remove });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server Error in removing the product from cart" });
    }
  },
  deleteCart: async (req, res) => {
    const userId = req.userId;
    try {
      const cart = await Cart.findOneAndDelete(userId);
      if(!cart){
        return res.status(400).json({message:"No products in the cart"})
      }
      res.status(200).json({ message: "Order successfully placed", cart });
    } catch (error) {
      res.status(500).json({ message: "Server error in deleting cart" });
    }
  },
  searchProduct: async(req, res)=>{
    try {
      const query = req.query.q
      console.log(query)
      const regex = new RegExp(query,"i","g")
      const product = await Product.find({
        "$or":[
          {
            productName:regex
          },
          {
            category:regex
          }
        ]
      })
    res.status(200).json({message:"Search results", product})
      
    } catch (error) {
      res.status(500).json({message:"Server error in searching the product", error})
    }
  }
};
export default productController;
