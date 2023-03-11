const mongoose =require("mongoose")
const ratingSchema = new mongoose.Schema({
    Doctors: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctors',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patients',
    },
  },{ timestamps:true}
  );
  const Rating = mongoose.model('Rating', ratingSchema);
  module.exports = Rating;