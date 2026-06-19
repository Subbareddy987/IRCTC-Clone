import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  findUserById,
  CreateUser,
} from "../models/userModel.js";
import { validateLogin, validateRegistration } from "../utils/authValidation.js";

export const registerUser = async (req, res) => {
  try {
    const { values, errors } = validateRegistration(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }
    const { full_name, email, password } = values;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await CreateUser(full_name, email, hashedpassword);
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { values, errors } = validateLogin(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }
    const { email, password } = values;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const ismatch = await bcrypt.compare(password, user.password_hash);
    if (!ismatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
