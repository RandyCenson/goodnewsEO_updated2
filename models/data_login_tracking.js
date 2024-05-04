const { Schema, model } = require('mongoose');

const user_data_schema = new Schema({
    email: {
        type:String,
        // required: true,
    },
    username:{
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now(),
    },

});

module.exports = model('user_login_tracking(collection)', user_data_schema)