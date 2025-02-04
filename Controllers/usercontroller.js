import mongoose from "mongoose";
import User from "../Models/usermodel.min.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
const userController = {
  signup: async (req, res) => {
    try {
      const { name, email, password, profilePicture } = req.body;
      // console.log(name, email, password, { profilePicture });
      const findUser = await User.findOne({ email });
      if (findUser) {
        return res.status(401).json({ message: "Email Id is already in use" });
      }
      const salt = bcryptjs.genSaltSync(10);
      const hashedPassword = await bcryptjs.hashSync(password, salt);
      // console.log(hashedPassword);

      if (!hashedPassword) {
        res.status(400).json({ message: "Error in encryption" });
      }
      const newUser = await new User({
        name,
        email,
        password: hashedPassword,
        profilePicture,
        role: "Customer",
      });
      await newUser.save();
      res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      // console.log(email, password);

      const user = await User.findOne({ email }).select("-_id, -__v");
      // console.log(user.password);

      if (!user) {
        return res.status(401).json({ message: "User does not exist" });
      }
      const comparePassword = await bcryptjs.compareSync(
        password,
        user.password
      );
      // console.log(comparePassword);

      if (!comparePassword) {
        return res
          .status(401)
          .json({
            message: "Invalid Password. Try again or reset the password",
          });
      }
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_secret
      );

      // Set HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: "/",
      });

      const userUpdate = await User.findOneAndUpdate(
        { email },
        { token: token }
      );
      await userUpdate.save();
      res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  getUserDetails: async (req, res) => {
    const userId = req.userId;
    console.log(userId);

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User found", user });
    } catch (error) {
      res.status(500).json({ message: "User Details error" });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("token");
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      res.status(500).json({ message: `Server Error ${err.message}` || err });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const userId = req.userId;
      // console.log(userId);
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role !== "Admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const users = await User.find();
      // console.log(users);

      res.status(200).json({ message: "Users found", users });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Internal Server Error ${error.message}` });
    }
  },
  editRoleDetails: async (req, res) => {
    const adminId = req.userId;
    const { userId, role } = req.body;
    try {
      const Admin = await User.findById(adminId);
      console.log(Admin);

      if (Admin.role !== "Admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userUpdate = await User.findByIdAndUpdate(userId, { role: role });
      await userUpdate.save();
      res.status(200).json({ message: "User details updated", userUpdate });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error in editing the role, ${error.message}` });
    }
  },
  editUserDetails: async (req, res) => {
    const { name, email, profilePicture } = req.body;
    try {
      const userId = req.userId;
      const user = await User.findByIdAndUpdate(userId, {
        name: name,
        email: email,
        profilePicture: profilePicture,
      });
      await user.save();
      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      res
        .status(500)
        .json({
          message: `Server Error in editing the user details, ${error.message}`,
        });
    }
  },
  deleteUser: async (req, res) => {
    const adminId = req.userId;

    const { userId } = req.params;
    try {
      const Admin = await User.findById(adminId);
      console.log(Admin);
      if (Admin.role !== "Admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User doesn't exist" });
      }
      const userDelete = await User.findByIdAndDelete(userId);
      res
        .status(200)
        .json({ message: "User deleted successfully", userDelete });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error in deleting the user, ${error.message}` });
    }
  },
  changePassword: async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    // console.log(oldPassword, newPassword);
    const userId = req.userId;
    try {
      const user = await User.findById(userId);
      const isValidPassword = await bcryptjs.compareSync(
        oldPassword,
        user.password
      );
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid old password" });
      }
      const salt = bcryptjs.genSaltSync(10);
      const hashedPassword = await bcryptjs.hashSync(newPassword, salt);
      // console.log(hashedPassword);
      const userUpdate = await User.findByIdAndUpdate(userId, {
        password: hashedPassword,
      });
      res
        .status(200)
        .json({ message: "Password changed successfully", userUpdate });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error in changing the password, ${error.message}` });
    }
  },
  forgotPassword: async (req, res, next) => {
    try {
      // getting the username

      const { email } = req.body;
      const user = await User.findOne({ email });
      // const token = await User.findOne({token})
      // console.log(user);
      if (!user) {
        return res.status(400).json({ message: "No such user exists" });
      } else {
        // generate a random string

        const token = crypto.randomBytes(10).toString("hex");
        // save the random string in database
        // console.log(token);
        user.token = token;
        await user.save();
        // Nodemailer
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "kamaleshwaranvlup@gmail.com",
            pass: process.env.Password,
          },
        });

        // Email parameters
        const option = {
          from: "kamaleshwaranvlup@gmail.com",
          to: email,
          subject: "Passwordreset",
          text: `Your Url for resetting the password, 
                    ${process.env.frontendUrl}resetpassword/${user._id}/${user.token}`,
        };

        // Sending the mail
        transporter.sendMail(option, function (error, info) {
          if (error) {
            res.status(400).json({ message: "Error sending the mail" });
          } else {
            res
              .status(200)
              .json({
                message:
                  "Email has been sent. Check your inbox. Go to Login page to log back in",
                info,
              });
          }
        });
      }
    } catch (error) {
      console.error("Error in forgotPassword controller:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      // Getting the userId and random string from the url as params
      const { userId, token } = req.params;
      const { password } = req.body;
      // console.log( password);
      // Checking both userId and token to find the user
      const user = await User.findOne({ _id: userId, token });
      // console.log(user);
      // const token = await User.findOne({token})
      if (!user) {
        return res.status(400).json({ message: "No such user exists" });
      }

      // If userId and token matched, hash the new  password and update it in the database
      const salt = bcryptjs.genSaltSync(10);
      const hashedPassword = await bcryptjs.hashSync(password, salt);
      // console.log(hashedPassword);
      await User.findByIdAndUpdate(user._id, { passwordHash: hashedPassword });
      await User.findByIdAndUpdate(user._id, { token: null });

      res
        .status(200)
        .json({
          message:
            "Password has been reset successfully. Login again to continue",
        });
    } catch (error) {
      console.error("Error in sending the url", error);

      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getuserDetailsById: async (req, res) => {
    const { userId } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: "No such user exist" });
      }
      res.status(200).json({ message: "Success", user });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
export default userController;
