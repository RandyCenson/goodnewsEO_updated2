const Data = require("../models/data_queue");
const getDatas = async (req, res) => {
    try {
        const data = await Data.find({});
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getData = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Data.findById(id);
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createData = async (req, res) => {
    try {
        const data = await Data.create(req.body);
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateData = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Data.findByIdAndUpdate(id, req.body);

        if (!data) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updatedData = await Data.findById(id);
        res.status(200).json(updatedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const deleteData = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Product.findByIdAndDelete(id);

        if (!data) {
            return res.status(404).json({ message: "data not found" });
        }

        res.status(200).json({ message: "data deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getDatas,
    getData,
    createData,
    updateData,
    deleteData
}