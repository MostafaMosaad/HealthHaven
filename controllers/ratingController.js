const Rating = require("../models/ratingModel")
const addRating= async (req, res) => {
    const { rating, Doctors} = req.body;
    
    try {
      const getRating= await  Rating.findOne({user:req.user.id,Doctors})
      if (getRating) {
      
        await Rating.findOneAndUpdate({user:req.user.id,Doctors},{rating})
      } else {
        
        const rate = new Rating({ rating, Doctors, user:req.user.id });
        await rate.save();
      }
      res.status(201).json({message:"ratingSaved"});
    } catch (err) {
      res.status(403).json({message:"error to save rate",...err})
    }
  }
  const getRating=async(req,res)=> {
    const {DoctorsId}=req.params
    const ratings = await Rating.find({ Doctors: DoctorsId });
    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
    res.status(201).json({message:"rated done",rate:averageRating})
  }

  module.exports={
    addRating,
    getRating
  }