const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authUser = async (token) => {
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decode.id });
    if (!user) {
      throw new Error('No user found');
    }
    return decode;
  } catch (error) {
    // console.error(error.message);
    return null;
  }
};
