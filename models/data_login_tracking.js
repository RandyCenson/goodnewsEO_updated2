const { Schema, model } = require('mongoose');

const user_data_schema = new Schema({
    // nomor:{
    //     type: Number,
    //     required: true
    // }, //otomatis kan saja di looping html

    email: {
        type:String,
        required: true,
    },

    date: {
        type: Date,
        default: Date.now(),
    },

});

module.exports = model('user_login_tracking(collection)', user_data_schema)