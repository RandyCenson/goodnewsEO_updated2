const { Schema, model } = require('mongoose');

const file_upload_schema = new Schema({
    field: {
        type: String,
    },
    img_path: {
        type: String,
        required: true
    },
    description: {
        type: String,
    }


});

module.exports = model('file_upload(collection)_gallery', file_upload_schema)