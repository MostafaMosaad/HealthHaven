const validator = require("validator")
const mongoose = require('mongoose')
const bcrybt = require("bcrypt")

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        validate: {
            validator: (email) => {
                return /\S+@\S+\.\S+/.test(email);
            },
            message: 'Invalid email format'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    phone:{
        type: String,
        validate(value){
            if(!validator.isMobilePhone(value, "ar-EG"))
                throw new Error ("invalid number")
        }
    },
    address:
    {
        type: String,
        required: true,
    },
    major: {
        type: String,
        required: true,
        minlength: 3
    },
    category: {
        type: String,
        required: true,
        minlength: 3
    },
    role:{
        type:String,
        default:"Doctor"
    },
    isVerifired: {
        type: Boolean,
        default: false
    },
    appointments: {
        type:[],
        default: [],
        validate: [arrayLimit, 'Bookings exceeds the limit of 5']
    },
 
});

function arrayLimit(val) {
    return val.length <= 300;
}

doctorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrybt.hash(this.password, 12);
    // this.confirmPassword = undefined

})
doctorSchema.methods.correctPassword = async function (candiditaPass, userPass) {
    return await bcrybt.compare(candiditaPass, userPass)
}

const Doctors = mongoose.model('Doctors', doctorSchema)

module.exports = Doctors;
