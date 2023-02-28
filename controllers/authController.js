const crypto = require('crypto');
const { promisify } = require("util");
const Admin = require("../models/adminModel");
const Doctor = require("../models/doctorModel");
const Users = require("../models/userModel");
const sendEmail = require('./../utils/email');
const jwt = require("jsonwebtoken");

const TokenSign = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = TokenSign(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.SignUp = async (req, res, next) => {
  let token;
  let data;
  try {
    if (req.body.hasOwnProperty("category")) {
      data = await Doctor.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        major: req.body.major,
        category: req.body.category,
        address: req.body.address,
        isVerifired: req.body.isVerifired,
      });
      token = TokenSign(data._id);
    } else if (req.body.hasOwnProperty("DateOfBirth")) {
      data = await Users.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        medicalHistory: req.body.medicalHistory,
        DateOfBirth: req.body.DateOfBirth,
      });
      token = TokenSign(data._id);
    } else {
      data = await Admin.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      token = TokenSign(data._id);
    }
    createSendToken(data, 201, res);
  
   
  } catch (er) {
    res.status(404).json({
      status: "invalid Entry",
      message: er,
    });
  }
  
};
exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let token;
    if (!email || !password) {
      return next(
        res.status(400).json({
          statue: "please Provide Email and password",
        })
      );
    }
    const test =
      (await Doctor.findOne({ email }).select("+password")) ||
      (await Admin.findOne({ email }).select("+password")) ||
      (await Users.findOne({ email }).select("+password"));
    const correcttest = await test.correctPassword(password, test.password);
    const isver = await test.isVerifired;
    const role = await test.role;
    let dataUser
    if (role == "User") {
      dataUser = role
    } else if (role == "Doctor") {
      dataUser = role
    }
    else dataUser = role

    if (test && correcttest) {
      if (isver || isver === undefined) {
        token = TokenSign(test._id);
        return next(
          res.status(200).json({
            statue: "Sucssess",
            token,
            dataUser
          })
        );
      } else {
        return next(
          res.status(200).json({
            statue: " Doctor Not Verifired Yet ",
          })
        );
      }
    } else{
      res.status(401).json({
        status: "Invalid Mail||Password",
        message: er,
      });
    }
  } catch (er) {
    res.status(401).json({
      status: "Invalid Mail||Password",
      message: er,
    });
  }
};
exports.protectA = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(
        res.status(401).json({
          status: "You are not logged in! Please log in to get access.",
        })
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await Admin.findById(decoded.id);
    if (!currentUser) {
      return next(
        res.status(401).json({
          status: "fail",
          message: "The user belonging to this token does no longer exist.",
        })
      );
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.admin = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: "You do not have permission to perform this action",
    });
  }
};
exports.protectD = async (req, res, next) => {
  // 1) Getting token and check of it's there
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(
        res.status(401).json({
          status: "You are not logged in! Please log in to get access.",
        })
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await Doctor.findById(decoded.id);
    if (!currentUser) {
      return next(
        res.status(401).json({
          status: "fail",
          message: "The user belonging to this token does no longer exist.",
        })
      );
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.doctor = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: "You do not have permission to perform this action",
    });
  }
};
exports.protectU = async (req, res, next) => {
  // 1) Getting token and check of it's there
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(
        res.status(401).json({
          status: "You are not logged in! Please log in to get access.",
        })
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await Users.findById(decoded.id);
    console.log(req.params.id)
    if(req.params.id)
    {
    if (currentUser && decoded.id !== req.params.id) {
      res.status(401).json({
        status: "You do not have permission to perform this action",
      });
    } else if (currentUser && decoded.id === req.params.id) {
      req.user = currentUser;
      next();
    }
  }
    else if(currentUser )
    {
      req.user = currentUser;
      next();
    }
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: "You do not have permission to perform this action",
    });
  }
};
exports.protectAD = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
      });
    }
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    const doctor = await Doctor.findById(decoded.id);
    if (doctor && decoded.id !== req.params.id) {
      res.status(401).json({
        status: "You do not have permission to perform this action",
      });
    } else if (doctor && decoded.id === req.params.id) {
      req.user = doctor;
      next();
    } else if (admin) {
      req.user = admin;
      next();
    }
    // 3) Check if user still exists
    if (!admin && !doctor) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token does no longer exist.",
      });
    }
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: "Invalid token",
    });
  }
};
exports.protectAU = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    const user = await Users.findById(decoded.id);
    if (user && decoded.id !== req.params.id) {
      res.status(401).json({
        status: "You do not have permission to perform this action",
      });
    } else if (user && decoded.id === req.params.id) {
      req.user = user;
      next();
    } else if (admin) {
      req.user = admin;
      next();
    }

    // 3) Check if user still exists
    if (!admin && !user) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token does no longer exist.",
      });
    }
    // GRANT ACCESS TO PROTECTED ROUTE
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: "Invalid token",
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return next('There is no user with email address.', 404);
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new 'There was an error sending the email. Try again later!',
      500
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await Users.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next('Token is invalid or has expired', 400);
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
};

exports.updatePassword = async (req, res, next) => {
  // 1) Get user from collection
  const user = await Users.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next('Your current password is wrong.', 401);
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
};
