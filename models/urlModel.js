const mongoose = require('mongoose')
const {Schema} = mongoose;

const urlSchema = new Schema({
    originalUrl :{
        type: String,
        required: true
    },
    alias : {
        type: String,
        required: true,
        unique: true
    }
})

const Url = mongoose.model('Url', urlSchema)

module.exports = Url