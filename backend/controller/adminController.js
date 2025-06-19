import User from '../Model/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ROLES } from '../utils/constants.js';
import path from 'path';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.isAdmin) {
      return res
        .status(401)
        .json({ message: "Invalid credentials or not an admin" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const payLoad = { id: user._id, isAdmin: user.isAdmin, name: user.name, email: user.email, role: ROLES.ADMIN };
    const token1 = jwt.sign(
      payLoad,
      process.env.JWT_SECRET || "yoursecretkey",
      { expiresIn: "7d" }
    );
    const token2 = jwt.sign(
      payLoad,
      process.env.JWT_SECRET_2 || "yoursecretkey2",
      { expiresIn: "7d" }
    );
    res.cookie('accessToken', token1, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
      sameSite: 'Lax', // Or 'None' + secure: true for cross-origin
    });
    res.cookie('refreshToken', token2, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
      sameSite: 'Lax', // Or 'None' + secure: true for cross-origin
      path:'/api/refresh'
    });
    res.status(200).json({
      message: "Admin login successful",
      token1,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error while deleting user." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { name, email } = req.body;

    user.name = name || user.name;
    user.email = email || user.email;

    if (req.file && req.file.path) {
      user.avatar = req.file.path; // Cloudinary URL
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully.",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error while updating user." });
  }
};


export const createUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully.",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        isAdmin: savedUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error while creating user." });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
  });

  return res.status(200).json({ message: 'Logout successful' });
};