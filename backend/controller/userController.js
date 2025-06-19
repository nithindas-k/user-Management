import User from '../Model/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword)
      return res.status(400).json({ message: 'All fields are required.' });

    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match.' });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    const payload = {
      id: savedUser._id,
      email: savedUser.email,
      name: savedUser.name,
      isAdmin: savedUser.isAdmin,
      role: savedUser.isAdmin ? 'admin' : 'user',
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_2, { expiresIn: '7d' });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
      sameSite: 'Lax',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'Lax',
      path: '/api/refresh',
    });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        isAdmin: savedUser.isAdmin,
        createdAt: savedUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      role: user.isAdmin ? 'admin' : 'user',
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_2, { expiresIn: '7d' });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000, // 1 hour
      sameSite: 'Lax',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'Lax',
      path: '/api/refresh',
    });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


export const verifyToken = async (req, res) => {
  try {
    const token = req.cookies.accessToken;


    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userWithRole = {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.isAdmin ? 'admin' : 'user',
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      message: 'Success',
      user: userWithRole,
      token,
    });

  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("Authenticated user:", req.user);

    const userId = req.params.id;
    
    // Check if user is updating their own profile or is admin
    // Note: req.user contains decoded JWT payload (id, role, etc.)
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: "Access denied. You can only update your own profile." 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { name, email } = req.body;

    // Validate input
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required." });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already taken." });
      }
    }

    // Update user fields
    user.name = name.trim();
    user.email = email.trim();

    // Handle avatar upload
    if (req.file && req.file.path) {
      // If user had previous avatar on Cloudinary, you might want to delete it
      // This is optional but good for cleanup
      if (user.avatar && user.avatar.includes('cloudinary')) {
        try {
          const publicId = user.avatar.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`user-profiles/${publicId}`);
        } catch (deleteError) {
          console.log('Error deleting old avatar:', deleteError);
          // Continue with update even if old image deletion fails
        }
      }
      
      user.avatar = req.file.path;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully.",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error("Error updating user:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        details: error.message 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Email is already taken." 
      });
    }
    
    res.status(500).json({ 
      message: "Server error while updating user.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};