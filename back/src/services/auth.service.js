const User = require("../models/User");
const { hashPassword, comparePassword } = require("./hash.service");
const { sendWelcomeEmail, sendPasswordResetEmail } = require("./mail.service");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role, username: user.name },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpiration },
  );
  return { accessToken };
};

const register = async (name, email, password) => {
  const candidate = await User.findOne({ email });
  if (candidate) throw new Error("User with this email already exists");

  const hashed = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashed,
    loginAttempts: 0,
  });

  sendWelcomeEmail(user.email, user.name).catch((err) =>
    console.error("Mail Error:", err),
  );

  return generateTokens(user);
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select(
    "+password +loginAttempts +lockUntil",
  );

  if (!user) throw new Error("Invalid email or password");

  const currentTime = Date.now();
  if (user.lockUntil && user.lockUntil > currentTime) {
    const remainingTime = Math.ceil((user.lockUntil - currentTime) / 1000);
    throw new Error(
      `Too many attempts. Account locked. Try again in ${remainingTime} seconds.`,
    );
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    const newAttempts = (user.loginAttempts || 0) + 1;

    if (newAttempts >= 3) {
      const lockTime = Date.now() + 3 * 60 * 1000;
      await User.updateOne(
        { _id: user._id },
        { $set: { lockUntil: lockTime, loginAttempts: 0 } },
      );
      throw new Error(
        "Too many attempts. Your account is blocked for 3 minutes.",
      );
    }

    await User.updateOne(
      { _id: user._id },
      { $set: { loginAttempts: newAttempts } },
    );

    throw new Error(
      `Invalid email or password. Attempts left: ${3 - newAttempts}`,
    );
  }

  await User.updateOne(
    { _id: user._id },
    {
      $set: { loginAttempts: 0 },
      $unset: { lockUntil: "" }, 
    },
  );

  return {
    ...generateTokens(user),
    user: {
      id: user._id,
      balance: user.balance,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};

const generateResetCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const resetCode = generateResetCode();
  const resetCodeExpiry = new Date(Date.now() + 30 * 60 * 1000);

  await User.updateOne(
    { _id: user._id },
    { $set: { resetCode, resetCodeExpiry } }
  );

  await sendPasswordResetEmail(user.email, user.name, resetCode);

  return { success: true, message: "Reset code sent to email" };
};

const verifyResetCode = async (email, resetCode) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (!user.resetCode || user.resetCode !== resetCode) {
    throw new Error("Invalid reset code");
  }

  if (new Date() > user.resetCodeExpiry) {
    throw new Error("Reset code has expired");
  }

  return { success: true, message: "Code verified" };
};

const resetPassword = async (email, resetCode, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (!user.resetCode || user.resetCode !== resetCode) {
    throw new Error("Invalid reset code");
  }

  if (new Date() > user.resetCodeExpiry) {
    throw new Error("Reset code has expired");
  }

  const hashedPassword = await hashPassword(newPassword);

  await User.updateOne(
    { _id: user._id },
    {
      $set: { password: hashedPassword },
      $unset: { resetCode: "", resetCodeExpiry: "" }
    }
  );

  return { success: true, message: "Password reset successfully" };
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new Error("User not found");

  const isMatch = await comparePassword(oldPassword, user.password);
  if (!isMatch) throw new Error("Old password is incorrect");

  const hashedPassword = await hashPassword(newPassword);

  await User.updateOne(
    { _id: user._id },
    { $set: { password: hashedPassword } }
  );

  return { success: true, message: "Password changed successfully" };
};

const findById = async (id) => {
  return await User.findById(id);
};

module.exports = {
  register,
  login,
  getUserById,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  changePassword,
  findById
};
