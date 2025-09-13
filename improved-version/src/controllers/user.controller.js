import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

// Create/Register User (Signup)
export const createUserController = async (req, res) => {
  try {
    const { name, email, password ,PhotoUrl} = req.body;

    // Input validation
    if (!name || !email || !password || PhotoUrl) {
      return res.status(400).json({
        message: "All fields (name, email, password ) are required",
        success: false,
        error: true
      });
    }

    // Email format validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
        success: false,
        error: true
      });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
        error: true
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
        success: false,
        error: true
      });
    }

    // Create new user (password will be hashed by pre-save hook)
    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
      PhotoUrl:PhotoUrl
    });

    // Remove password from response for security
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      PhotoUrl:newUser.PhotoUrl,
      createdAt: newUser.createdAt
    };

    return res.status(201).json({
      message: "User created successfully",
      data: userResponse,
      success: true,
      error: false
    });

  } catch (error) {
    console.log("Create User Error:", error);
    return res.status(500).json({
      error: error.message,
      message: "Something went wrong while creating user",
      success: false,
      error: true
    });
  }
};

// Sign In User (Login)
export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
        error: true
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
        success: false,
        error: true
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email });
    console.log("user found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(401).json({ // Fixed typo: was "res.josn"
        message: "Invalid credentials",
        success: false,
        error: true
      });
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
        error: true
      });
    }

    
    const jwtToken = jwt.sign(
      { 
        userId: user._id, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '24h'
      }
    );

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    };

    // Set cookie
    res.cookie("token", jwtToken, cookieOptions);

    // Prepare user response (without password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    return res.status(200).json({
      message: "Login successful",
      user: userResponse, 
      token: jwtToken,
      success: true,
      error: false
    });

  } catch (error) {
    console.log("Sign In Error:", error);
    
    return res.status(500).json({
      error: error.message,
      message: "Something went wrong during login",
      success: false,
      error: true
    });
  }
};

// Get User Profile (for authenticated user)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true
      });
    }

    return res.status(200).json({
      message: "User profile retrieved successfully",
      data: user,
      success: true,
      error: false
    });

  } catch (error) {
    console.log("Get Profile Error:", error);
    
    return res.status(500).json({
      error: error.message,
      message: "Something went wrong while fetching profile",
      success: false,
      error: true
    });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
    });

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
      error: false
    });

  } catch (error) {
    console.log("Logout Error:", error);
    
    return res.status(500).json({
      error: error.message,
      message: "Something went wrong during logout",
      success: false,
      error: true
    });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email,PhotoUrl } = req.body;
    const userId = req.userId;

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) {
      // Check if email already exists (for other users)
      const existingUser = await User.findOne({ 
        email: email, 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return res.status(409).json({
          message: "Email already exists",
          success: false,
          error: true
        });
      }
      updateData.email = email;
      updateData.PhotoUrl = PhotoUrl;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    return res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
      success: true,
      error: false
    });

  } catch (error) {
    console.log("Update Profile Error:", error);
    
    return res.status(500).json({
      error: error.message,
      message: "Something went wrong while updating profile",
      success: false,
      error: true
    });
  }
};