const express = require("express");
const Data = require("../models/data_queue");
const router = express.Router();
const {getDatas, getData, createData, updateData, deleteData, } = require("../controllers/data_queue_controllers");

router.get('/', getDatas);
router.get('/:id', getData);
router.post('/', createData);
router.put('/', updateData);
router.delete('/', deleteData);
module.exports = router


