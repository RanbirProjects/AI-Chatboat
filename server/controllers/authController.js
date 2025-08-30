const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (userExists) {
      return res.status(400).json({
        error: 'User already exists with this email or username'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({
        error: 'Invalid user data'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Server error during registration'
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Update last seen
    await user.updateLastSeen();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      preferences: user.preferences,
      stats: user.stats,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Server error during login'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Server error while fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { username, email, avatar, preferences } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check if username/email already exists (if changing)
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({
          error: 'Username already taken'
        });
      }
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          error: 'Email already registered'
        });
      }
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar !== undefined) user.avatar = avatar;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      preferences: updatedUser.preferences,
      stats: updatedUser.stats
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Server error while updating profile'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Please provide current and new password'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        error: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Server error while changing password'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  try {
    // Set user offline
    await req.user.setOffline();

    res.json({
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Server error during logout'
    });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
const refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Generate new token
    const newToken = generateToken(user._id);

    res.json({
      token: newToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      error: 'Server error while refreshing token'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  logoutUser,
  refreshToken
};
