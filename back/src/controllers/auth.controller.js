const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const user = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentUser = await authService.getUserById(userId);
    res.json(currentUser);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const deposit = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await authService.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.balance += Number(amount);
    await user.save();

    res.status(200).json({
      success: true,
      newBalance: user.balance,
      message: "Deposit successful",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const result = await authService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const verifyResetCode = async (req, res) => {
  try {
    const { email, resetCode } = req.body;
    if (!email || !resetCode) {
      return res.status(400).json({ error: "Email and reset code are required" });
    }

    const result = await authService.verifyResetCode(email, resetCode);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ error: "Email, reset code, and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const result = await authService.resetPassword(email, resetCode, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Old and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const result = await authService.changePassword(userId, oldPassword, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login, user, deposit, forgotPassword, verifyResetCode, resetPassword, changePassword };
