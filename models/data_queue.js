const { Schema, model } = require('mongoose');

const queue_data_schema = new Schema({
    // nomor:{
    //     type: Number,
    //     required: true
    // }, //otomatis kan saja di looping html
    
    tanggal: {
        type : Date, 
        default: Date.now(),
        // required: true,
    },
    orderedby: {
        type: String,
        required: true
    },
    handler: {
        type: String,
        // required: true
    },

});

module.exports = model('data_queue(collection)', queue_data_schema)