const { Schema, model } = require('mongoose');

const user_data_schema = new Schema({
    // nomor:{
    //     type: Number,
    //     required: true
    // }, //otomatis kan saja di looping html
    username:{
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
    },

});

module.exports = model('user_data(collection)', user_data_schema)