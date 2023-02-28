const Users = require('../models/userModel');
const Doctors = require('../models/doctorModel');
const { promisify } = require("util");
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find(req.query)
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  }
  catch {
    res.status(404).json({
      status: 'Fail',
      message: 'Error getting all users'
    })
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  }
  catch {
    res.status(404).json({
      status: 'Fail',
      message: 'Error getting user'
    })
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await Users.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  }
  catch (err) {
    res.status(400).json({
      status: 'Failed Creating User',
      message: err
    })
  }
};
exports.Booking= async (req, res) => {
  try {
    let user = await Users.findById(req.params.id);
   
    const doctor = await Doctors.findById(req.body.doctor);
    user.bookings.push({
      id:req.body.doctor,
      doctorName: doctor.name,
      date: req.body.data
    });
    await Users.findByIdAndUpdate(req.params.id,user, {
      new: true,
      runValidators: true,
    });
    const appointment = {
      user: user.name,
      id:req.params.id,
      date:new Date(Date.now())
    };
    doctor.appointments.push(appointment);
    await Doctors.findByIdAndUpdate(req.body.doctor, doctor, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  
  }
  catch (err) {
    // console.log(err)
    res.status(400).json({
      status: 'Failed Booking Doctor !!!!',
      message: err
})}

}

exports.updateUser = async (req, res) => {
  try {
    let user = await Users.findById(req.params.id);
    if(req.body.hasOwnProperty("medicalHistory"))
    {
          user.medicalHistory.push(
            req.body.medicalHistory
          );
    }
    await Users.findByIdAndUpdate(req.params.id,user, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  }
  catch (err) {
    // console.log(err)
    res.status(400).json({
      status: 'Failed Updating User',
      message: err
  })
}
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id)
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  }
  catch (err) {
    res.status(400).json({
      status: 'Failed Deleting User',
      message: err
    })
  }
};

exports.updateMe = (async (req, res, next) => {

  const filteredBody = filterObj(req.body, 'email','phone');

  // 3) Update user document
  const updatedUser = await Users.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.getMe = (async (req, res, next) => {
  const User = await Users.findById(req.user.id)
  res.status(200).json({
    status: 'success',
    data: {
      user: User
    }
  });
});