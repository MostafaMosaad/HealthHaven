const Admin = require('../models/doctorModel');
const mongoose = require('mongoose')
const bcrybt = require("bcrypt")

const adminSchema = new mongoose.Schema({
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
        minlength: 8
    },
    role:{
        type:String,
        default:"Admin"
    },
});

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrybt.hash(this.password, 12);
    // this.confirmPassword = undefined

})
adminSchema.methods.correctPassword = async function (candiditaPass, userPass) {
    return await bcrybt.compare(candiditaPass, userPass)
}

const admin = mongoose.model('Admin', adminSchema)

module.exports = admin;