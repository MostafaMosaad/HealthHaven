const Users = require("../models/userModel");
const Doctors = require("../models/doctorModel");
const { promisify } = require("util");

const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = "0" + dd;
if (mm < 10) mm = "0" + mm;

const formattedToday = dd + "/" + mm + "/" + yyyy;
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find(req.query);
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch {
    res.status(404).json({
      status: "Fail",
      message: "Error getting all users",
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch {
    res.status(404).json({
      status: "Fail",
      message: "Error getting user",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await Users.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed Creating User",
      message: err,
    });
  }
};
exports.Booking = async (req, res) => {
  try {
    let userr = await Users.findById(req.user.id);

    const doctor = await Doctors.findById(req.body.doctor);

    userr.bookings.push({
      id: req.body.doctor,
      doctorName: doctor.name,
      doctorCategory: doctor.category,
      doctorMajor: doctor.major,
      doctorPhone: doctor.phone,
      doctorAddress: doctor.address,
      doctorEmail: doctor.email,
      date: req.body.date,
      time: req.body.time,
    });
    await Users.findByIdAndUpdate(req.user.id, userr, {
      new: true,
      runValidators: true,
    });
    const appointment = {
      user: userr.name,
      id: req.user.id,
      medical: [],
      time: req.body.time,
      date: req.body.date,
    };
    appointment.medical.push(userr.medicalHistory);
    doctor.appointments.push(appointment);
    await Doctors.findByIdAndUpdate(req.body.doctor, doctor, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        userr,
      },
    });
  } catch (err) {
    // console.log(err)
    res.status(400).json({
      status: "Failed Booking Doctor !!!!",
      message: err,
    });
  }
};
exports.CancelBook = async (req, res) => {
  try {
    let userr = await Users.findById(req.user.id);
    const doctor = await Doctors.findById(req.body.doctor);
    for (let i = 0; i < userr.bookings.length; i++) {
      for (let j = 0; j < doctor.appointments.length; j++) {
        if (userr.bookings[i].id === req.body.doctor) {
          if (doctor.appointments[j].id === req.user.id) {
            userr.bookings.splice(i, 1);
            doctor.appointments.splice(j, 1);
            await Users.findByIdAndUpdate(req.user.id, userr, {
              new: true,
              runValidators: true,
            });
            await Doctors.findByIdAndUpdate(req.body.doctor, doctor, {
              new: true,
              runValidators: true,
            });
          }
        }
      }
    }

    res.status(200).json({
      status: "success",
      data: {
        userr,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed cancel",
      message: err,
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
    let user = await Users.findById(req.params.id);
    let doctor = await Doctors.findById(req.user.id);

    const MedicalHistory = {
      id: req.params.id,
      Discriptions: req.body.Discriptions,
      Labs: req.body.Labs,
      Pharmacies: req.body.Pharmacies,
      DocName: doctor.name,
      date: formattedToday,
    };
    // console.log(MedicalHistory);
    if (req.body.hasOwnProperty("medicalHistory")) {
      user.medicalHistory.push(MedicalHistory);
      for (let j = 0; j < doctor.appointments.length; j++) {
        if (doctor.appointments[j].id === req.params.id) {
          doctor.appointments[j].medical[0].push(MedicalHistory);
          // console.log(doctor.appointments[j].medical[0])
        }
      }
      await Doctors.findByIdAndUpdate(req.user.id, doctor, {
        new: true,
        runValidators: true,
      });
      await Users.findByIdAndUpdate(req.params.id, user, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed Updating User",
      message: err,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed Deleting User",
      message: err,
    });
  }
};

exports.updateMe = async (req, res, next) => {
  const filteredBody = filterObj(req.body, "email", "phone", "name");

  // 3) Update user document
  const updatedUser = await Users.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
};

exports.getMe = async (req, res, next) => {
  const User = await Users.findById(req.user.id);
  res.status(200).json({
    status: "success",
    data: {
      user: User,
    },
  });
};
