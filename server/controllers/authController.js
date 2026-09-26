import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// Public registration
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
      year,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "Student",
      department: department || "",
      year: year || "",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed.",
      error: error.message,
    });
  }
};


// Create Student or Faculty account from Administration
export const createUserByAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
      year,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password, and role are required.",
      });
    }

    if (!["Student", "Faculty"].includes(role)) {
      return res.status(400).json({
        message: "Admin can create only Student or Faculty accounts.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      department: department || "",
      year: year || "",
    });

    res.status(201).json({
      message: `${role} account created successfully.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create account.",
      error: error.message,
    });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
};


export const getCurrentUser = async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};
// Get all Student and Faculty accounts for Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["Student", "Faculty"] },
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users.",
      error: error.message,
    });
  }
};

// Delete a Student or Faculty account
export const deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (!["Student", "Faculty"].includes(user.role)) {
      return res.status(403).json({
        message: "Admin accounts cannot be deleted here.",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: `${user.role} account deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete account.",
      error: error.message,
    });
  }
};