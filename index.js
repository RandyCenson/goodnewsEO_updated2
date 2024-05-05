if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require("express"); //
const dotenv = require("dotenv");//
var multer = require('multer');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');//
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const morgan = require('morgan');
const bcrypt = require('bcrypt');

const secret = 'mysecretkey';

const app = express(); //

dotenv.config();//
const port = process.env.PORT || 5000//

mongoose.connect(process.env.MONGO_URL).then(
    () => console.log(`mongoose(database) connected at ${process.env.MONGO_URL}`),
    err => console.log('error here: ', err),
);



app.use(morgan('start'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static("public"));

app.set("view engine", "ejs");


//callback url

app.get("/", async (req, res) => {
    try {
        const data_req = await collection_dataqueue.find();
        const data_file_upload_req = await collection_file_upload.find();
        res.render("index.ejs");
    } catch (err) {
        console.error("Error fetching data:", err);
        // Handle errors appropriately (e.g., render an error page)
    }
});

app.get("/index", async (req, res) => {
    try {
        const data_req = await collection_dataqueue.find();
        const data_file_upload_req = await collection_file_upload.find();
        res.render("index.ejs");
    } catch (err) {
        console.error("Error fetching data:", err);
        // Handle errors appropriately (e.g., render an error page)
    }
});

app.get("/gallery", async (req, res) => {
    const data_gallery_req = await collection_file_upload_gallery.find();
    res.render("gallery.ejs", { data_gallery: data_gallery_req });
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.get("/login", (req, res) => {
    res.render("login_willy.ejs", { messages: "" });
})
app.get('/admin', verifyTokenAdmin, async (req, res) => {
    try {
        
        res.render("admin.ejs",);
    } catch (err) {
        console.error("Error fetching data:", err);
    }
});

app.listen(port, () => {
    console.log(`Server listening on porty ${port}`);
});
