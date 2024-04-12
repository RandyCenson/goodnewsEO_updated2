if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require("express"); //
const dotenv = require("dotenv");//


const mongoose = require('mongoose');//
// const path = require("path");
const morgan = require('morgan');
const collection_dataqueue = require("./models/data_queue");
const collection_userdata = require("./models/data_user");
const collection_user_login_tracking = require("./models/data_login_tracking");

const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');
const app = express(); //

dotenv.config();//
const port = process.env.PORT || 5000//

mongoose.connect(process.env.MONGO_URL).then(
    () => console.log(`mongoose(database) connected at ${process.env.MONGO_URL}`),
    err => console.log('error here: ', err),
);//14


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(morgan('start'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use("/api/data", require("./routes/data_router"));
const passport = require('passport');

const initializepassport = require('./passport_config');
const router = require('./routes/data_router');

initializepassport(passport, email => users.find(user => user.email === email), id => users.find(user => user.id === id));
app.use(passport.initialize());
app.use(passport.session());



var users = []
//cek sudah login atau belum
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/index");
    }
    next();
}

//register
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let datausers = {
            id: Date.now().toString(),
            username: req.body.name,
            email: req.body.email,
            password: hashedPassword
        };
        const data = await collection_userdata.create(datausers);
        console.log(data);
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
    // console.log(req.body);
});


//post login
app.post("/login", async function (req, res) {
    try {
        // check if the user exists
        const user = await collection_userdata.findOne({ email: req.body.email });
        if (user) {
            //check if password matches
            const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isPasswordMatch) {
                // res.send("wrong Password");
                return res.status(401).render("login_willy",{ messages: "password wrong" });
            }
            else {
                collection_user_login_tracking.create({email: req.body.email, date: Date.now()});
                res.redirect("/index");
            }
        }
        else if (req.body.email == "") {
            return res.status(401).render("login_willy",{ messages: "email section is empty" });
        }
        else {
            return res.status(401).render("login_willy",{ messages: "email not found" });
            
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

//post logout
app.post('/logout', (req, res, next) => {
    req.logOut(
        (err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/login');
        }
    );

})

//interaksi admin
app.post("/add_queue", async (req, res) => {
    const data = {
        date: req.body.date,
        orderedby: req.body.orderedby,
        handler: req.body.handler
    }
    const userdata = await collection_dataqueue.insertMany(data);
    console.log(userdata);
    res.redirect("/admin");
})

app.get('/admin', async (req, res) => {
    try {
        const data_req = await collection_dataqueue.find();
        const data_user_req = await collection_userdata.find();
        const data_user_login_req = await collection_user_login_tracking.find();
        res.render("admin.ejs", { title: "Admin", data_queue: data_req, data_user: data_user_req , data_user_login: data_user_login_req});
    } catch (err) {
        console.error("Error fetching data:", err);
    }
});
app.get('/delete_queue/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await collection_dataqueue.deleteOne({ _id: id });
        res.redirect("/admin");
    } catch (error) {
        console.error('Error deleting data:', error);
    }
})

app.put('/update_queue/:id', async (req, res) => {
    //gagal
    try {
        const { id } = req.params;
        // await collection_dataqueue.replaceOne( { _id: id} , {
        //     $set: {
        //         tanggal: Date.now(),
        //         orderedby: 'req.body.orderedby',
        //         handler: 'req.body.handler'
        //     }
        // });
        let datausers = await collection_dataqueue.find();

        // console.log(datausers.find(data => data._id == id));
        await datausers.updateOne({ _id: id }, {
            $set: {
                date: req.body.date_update,
                handler: req.body.handler_update,
                orderedby: req.body.orderedby_update,
            }
        })
        res.redirect("/admin");
    } catch (error) {
        console.error('Error updating data:', error);
    }
})


//callback url

app.get("/", async (req, res) => {
    try {
        const data_req = await collection_dataqueue.find();
        res.render("index.ejs", { title: "Admin", data_queue: data_req });
    } catch (err) {
        console.error("Error fetching data:", err);
        // Handle errors appropriately (e.g., render an error page)
    }
});

app.get("/index", async (req, res) => {
    try {
        const data_req = await collection_dataqueue.find();
        res.render("index.ejs", { title: "Admin", data_queue: data_req });
    } catch (err) {
        console.error("Error fetching data:", err);
        // Handle errors appropriately (e.g., render an error page)
    }
});

app.get("/gallery", (req, res) => {
    res.render("gallery.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login_willy.ejs",{ messages: "" });
})


app.listen(port, () => {
    console.log(`Server listening on porty ${port}`);
});
