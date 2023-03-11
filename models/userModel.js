const validator = require("validator")
const mongoose = require('mongoose')
const bcrybt = require("bcrypt")
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 6
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        minlength: 5
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select :false
    },
    phone:{
        type: String,
        validate(value){
            if(!validator.isMobilePhone(value, "ar-EG"))
                throw new Error ("invalid number")
        }
    },
    medicalHistory: {
        type: [{}],
        date: {
            type: Date,
            required: true,
            default: Date.now
        }
    },
    bookings: {
        type: [],
        default: [],
        validate: [bookingLimit, 'Bookings exceeds the limit of 5']
    },
    missedBookings: {
        type: [{
            doctor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Doctor'
            },
            date: {
                type: Date,
                required: true,
                default: Date.now
            }
        }],
        default: [],
        validate: [missedLimit, 'User Blocked']
    },
    role:{
        type:String,
        default:"User"
    },
    DateOfBirth:
    {
        type: String,
        required: true,
        // default: Date.now
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrybt.hash(this.password, 12);
    // this.confirmPassword = undefined
    next();
})

userSchema.methods.correctPassword = async function (candiditaPass, userPass) {
    return await bcrybt.compare(candiditaPass, userPass)
}


userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};



function bookingLimit(val) {
    return val.length <= 300;
}
function missedLimit(val) {
    return val.length <= 2;
}

const Users = mongoose.model('Patients', userSchema)

module.exports = Users;