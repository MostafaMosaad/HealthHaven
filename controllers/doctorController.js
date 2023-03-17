const Doctors = require("../models/doctorModel");
const Users = require("../models/userModel");
const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = "0" + dd;
if (mm < 10) mm = "0" + mm;

const formattedToday = dd + "/" + mm + "/" + yyyy;
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getAllDoctorsAdmin = async (req, res) => {
  try {
    const doctors = await Doctors.find(req.query);

    res.status(200).json({
      status: "success",
      results: doctors.length,
      data: {
        doctors,
      },
    });
  } catch {
    res.status(404).json({
      status: "Fail",
      message: "Error getting all doctors",
    });
  }
};
exports.getAllDoctorsUsers = async (req, res) => {
  try {
    const doctors = await Doctors.find({ isVerifired: true });
    res.status(200).json({
      status: "success",
      results: doctors.length,
      data: {
        doctors,
      },
    });
  } catch {
    res.status(404).json({
      status: "Fail",
      message: "Error getting all doctors",
    });
  }
};

exports.getDoctor = async (req, res) => {
  try {
    const doctor = await Doctors.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        doctor,
      },
    });
  } catch {
    res.status(404).json({
      status: "Fail",
      message: "Error getting doctor",
    });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const newDoctor = await Doctors.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        user: newDoctor,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed Creating New Doctor",
      message: err,
    });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctors.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        doctor,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed Updating doctor",
      message: err,
    });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctors.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        doctor,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed Deleting doctor",
      message: err,
    });
  }
};
exports.updateMe = async (req, res, next) => {

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "phone","name","email","address");

  // 3) Update user document
  const updatedUser = await Doctors.findByIdAndUpdate(
    req.doctor.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
};

exports.getMe = (async (req, res, next) => {
  const doctor = await Doctors.findById(req.doctor.id)
  res.status(200).json({
    status: 'success',
    data: {
      doctor: doctor
    }
  });
});


exports.BookingAgain = async (req, res) => {
  try {
    // console.log(req.body.PatientID)
    let userr = await Users.findById(req.body.PatientID);
// console.log(userr)
    const doctor = await Doctors.findById(req.doctor.id);
    // console.log(doctor)

    userr.bookings.push({
      id: req.doctor.id,
      doctorName: doctor.name,
      doctorCategory: doctor.category,
      doctorMajor: doctor.major,
      doctorPhone: doctor.phone,
      doctorAddress: doctor.address,
      doctorEmail: doctor.email,
      date: req.body.date,
      time:req.body.time,
      again:true,

    });
    await Users.findByIdAndUpdate(req.body.PatientID, userr, {
      new: true,
      runValidators: true,
    });
    const appointment = {
      user: userr.name,
      id: req.body.PatientID,
      medical: [],
      again:true,
      time:req.body.time,
      date: req.body.date,

    };
    appointment.medical.push(userr.medicalHistory);
    doctor.appointments.push(appointment);
    await Doctors.findByIdAndUpdate(req.doctor.id, doctor, {
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
