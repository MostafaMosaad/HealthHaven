const Doctors = require("../models/doctorModel");

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
  const filteredBody = filterObj(req.body, "phone");

  // 3) Update user document
  const updatedUser = await Doctors.findByIdAndUpdate(
    req.user.id,
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