require("dotenv").config();
const express = require("express");
require("../src/db/conn");
const message = require("../src/models/message");
const user = require("../src/models/user");
const home = require("../src/models/home");
const homeInterest = require("../src/models/homeInterest");
const app = express();
const path = require("path");
// const port = process.env.port || 3000;
const { mongo } = require("mongoose");
const hbs = require("hbs");
const { link } = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auths");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require('fs');
//setting path


const staticpath = path.join(__dirname, "../public");
const temPath = path.join(__dirname, "../templates/views");
const krnababaPath = path.join(__dirname, "../css/style.css");


var moment = require('moment');
const { count } = require("console");
app.locals.moment = require('moment');

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")));
app.use(express.static(staticpath));
app.set("views", temPath);
app.set("view engine", "ejs");
app.set('json spaces', '  ');

// set Storage Engine 

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.mkdir('./public/images/Reddit-F/', (err) => {
            cb(null, './public/images/Reddit-F/');
        });
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "__" + Date.now() + path.extname(file.originalname)
        );
    },
});
var storage_user = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images/Reddit-F/");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "__" + file.originalname
        );
    },
});

var upload = multer({ storage: storage });
var upload_user = multer({ storage: storage_user });


// landing page GET _-_ {START} _________
app.get("/", async (req, res) => {
    try {
        // render Maximam 10 home data to landing page for showcase
        const getHome = await home.find({}).sort({ _id: -1 }).limit(10);

        // user verification -- {START} --
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        const userDetails = await user.findOne({ _id: verifyUser._id });

                        // if user isn't verifyed number with firebase then throw an error and render to verification page !
                        if (userDetails.isVerified != true) {
                            console.log("user not verified")
                            // redirecting to page
                            res.redirect(`/verifyOtp?phoneNo=${phoneNo}`); // grab user phone number
                        }

        // user verification -- {END} --

        res.render("index", { getHome, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email });
    } catch (e) {
        // if user is not logged in , GET home data to landing too !
        const getHome = await home.find({}).sort({ _id: -1 }).limit(10);
        res.render("index", { getHome });
    }
});
// landing page GET _-_ {END} _________


// Home(individual property section) page GET _-_ {START} _________
app.get("/home", async (req, res) => {
    try {
        // getting home ._id from searchBar---
        var id = req.query.h_id;

        // user verification -- {START} --
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        const userDetails = await user.findOne({ _id: verifyUser._id });
        // user verification -- {END} --

        // after getting home ._id .. its will find home data in database 
        // and limit keyword check that only one home data is passing. -- {START} --
        const getHome = await home.find({ _id: id }).limit(1);
        console.log(getHome.length);
        // -- {END} --

        // to get actual time property uploaed -- moment npm make time format more readable -- 
        var receivedAt = req.body.receivedAt
        let createdOn = moment(receivedAt).toString();

        // check if ONLY ONE home data is passing or not if limit is greater than 1 .. 
        // make foundHome = false and it will redirect to landing page else foundHome = true , show home data
        if (getHome.length == 1) {
            res.render("home", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email, foundHome: true, moment: moment, getHome });
        } else {
            res.render("home", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userEmail: userDetails.email, userPhoto: userDetails.user_photo, foundHome: false });
        }
    } catch (e) {
        // if user is not logged in , render to login page !
        res.render("login", {
            // throw error !
            err: "login first"
        });
        res.send(e);
        // console.log(e);
    }
});
// Home(individual property section) page GET _-_ {END} _________

// Home Interest(Grab tha user addition info & home data and store in database) page POST _-_ {START} _________
app.post("/homeInterest", async (req, res) => {
    // getting home ._id from searchBar---
    var id = req.query.h_id;

    // user verification -- {START} --
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verifyUser);
    const userDetails = await user.findOne({ _id: verifyUser._id });
    // user verification -- {START} --

    // after getting home ._id .. its will find home data in database 
    // and limit keyword check that only one home data is passing. -- {START} --
    const getHome = await home.find({ _id: id }).limit(1);
    //  {END}


    // grab the information from FORM (HTML FORM)  and store in database !! -- {START} --
    const message_add = req.body.message_add;
    const buying_firstTime = req.body.buying_firstTime;
    const plan_on_buying_home = req.body.plan_on_buying_home;
    const active_military_status = req.body.active_military_status;
    // grab the information from FORM (HTML FORM)  and store in database !! -- {END} --

    try {
        // its will update the null filed with user infomation
        const updateUser = await homeInterest.updateMany({
            // $set is used to set the value !
            $set: {
                UserAdditionalDeatils: {
                    message_add,
                    buying_firstTime,
                    plan_on_buying_home,
                    active_military_status,
                },
            }
        })
        // debug !
        console.log(updateUser);

        res.status(200).render("home", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email, interestSubmitted: true, getHome });
    } catch (e) {
        res.send(e);
        console.log(e);
    }
})
// Home Interest(Grab tha user addition info & home data and store in database) page POST _-_ {END} _________


// about page(about site and ME ! section) page GET _-_ {START} _________ 
app.get("/aboutmore", async (req, res) => {
    try {

        // user verification -- {START} --
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        const userDetails = await user.findOne({ _id: verifyUser._id })
        // user verification -- {END} --

        res.render("aboutmore", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email });
    } catch (e) {
        res.render("aboutmore");
    }
});
// about page(about site and ME ! section) page GET _-_ {END} _________ 

// contact page(if user have any query) page GET _-_ {START} _________
app.get("/contact", async (req, res) => {
    try {


        var err; // unused for now

        // user verification -- {START} --
        // CONTACT PAGE IS STRICTlY FOR REGISTERED USER ___
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        const userDetails = await user.findOne({ _id: verifyUser._id });
        // user verification -- {END} --

        res.render("contact", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email });
    } catch (e) {
        // if user is not logged in ... render him to login page !
        res.render("login",
            // and throw ERROR !
            { err: "login required" });
    }
});
// contact page(if user have any query) page GET _-_ {END} _________

// contact page(if user have any query) page POST _-_ {START} _________
app.post("/contact", auth, async (req, res) => {
    try {

        // user verification -- {START} --
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        const userDetails = await user.findOne({ _id: verifyUser._id });
        // user verification -- {END} --

        // Grab the data from user and store in database for further query resolution -- {START} --
        const addNewMsg = new message({
            name: req.body.nameM,
            email: req.body.emailM,
            message: req.body.message,
            userId: req.body.userId,
            userPhoto: req.body.userPhoto,
            phone: req.body.phone,
        });
        // Grab the data from user and store in database for further query resolution -- {END} --

        //  save new message !
        const newMessage = await addNewMsg.save();

        //   console.log(newMessage);
        res.render("contact", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email, success: "true" })
    } catch (e) {
        res.send(e);
        // if user is not logged in ... render him to login page !
        res.render("login",
            // and throw ERROR !
            { err: "Login required", success: "false" });
        console.log(e);
    }
})
// contact page(if user have any query) page POST _-_ {END} _________


// LogIn page page GET _-_ {START} _________
app.get("/login", (req, res) => {
    res.render("login");
});
// LogIn page page GET _-_ {END} _________

// User page page GET _-_ {START} _________
app.get("/user", async (req, res) => {

    // user verification -- {START} --
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verifyUser);
    const userDetails = await user.findOne({ _id: verifyUser._id });
    // user verification -- {END} --
    const getUsers = await user.find({ _id: verifyUser._id }); //non-used for now !


    try {
        // getting home ._id from searchBar---
        var id = req.query._id;

        // after getting user ._id .. its will find user data in database 
        // and limit keyword check that only one user data is passing. -- {START} --
        const foundUser = await user.find({ _id: id }).limit(1);
        // {END}

        // after getting user ._id .. its will find user uploaded home data in database -- {START} --
        const foundUserUp = await home.find({ user_idbyUp: id });
        // {END}

        console.log(foundUserUp.length);// testing 

        // to get actual time property uploaed -- moment npm make time format more readable -- 
        var created_at = req.body.created_at;
        let createdOn = moment(created_at).toString();

        

        // check if ONLY ONE user data is passing or not if limit is greater than 1 .. 
        // make getUser = false and it will redirect to landing page else getUser = true , show user data
        if (foundUser.length == 1) {
            console.log(foundUser.length); //testing
            res.render("user", { foundUserUp, foundUser, getUser: true, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email, moment: moment });
        } else {
            res.render("user", { foundUserUp, foundUser, getUser: false, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email, moment: moment });
        }

    } catch (e) {
        // if user is not logged in , render to login page !
        res.render("login",
            // throw ERROR !
            { err: "Login required" });
        console.log(e);
    }
})
// User page page GET _-_ {END} _________

// User page page POST _-_ {START} _________
app.post("/user", upload_user.fields([{ name: "user_photo", maxCount: 1 }]), async (req, res) => {
    // taking img using multer (npm package) and store in database !

    // user verification -- {START} --
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verifyUser);
    const userDetails = await user.findOne({ _id: verifyUser._id });
    // user verification -- {END} --

    const getHome = await home.find({});
    const getUsers = await user.find({ _id: verifyUser._id }); // unused for now
    try {
        // taking image from body !
        var { user_photo } = req.body;
        console.log(user_photo);
        var { newphone } = req.body;
        console.log(newphone);

        // find image filed and update to user selected images !
        const updateUserPhoto = await user.updateOne({ phone: req.body.newphone }, { user_photo: req.body.user_photo });
        console.log(updateUserPhoto); //testing...

        res.render("user", { getHome, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userEmail: userDetails.email, userPhoto: userDetails.userPhoto, newAvatarSet: "done", head: "Awesome Avatar", message: " Avatar soon reflect to your profile ", type: "success" });
    } catch (e) {
        // if any error throw that !
        res.send(e);
        console.log(e);
    }
})
// User page page POST _-_ {END} _________

// User signup page page GET _-_ {START} _________
app.get("/signup", (req, res) => {
    res.render("signup");
});
// User signup page page GET _-_ {END} _________

// Post Property page page GET _-_ {START} _________
app.get("/PostProperty", async (req, res) => {
    try {

        // user verification -- {START} --
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser); // testing ..
        const userDetails = await user.findOne({ _id: verifyUser._id });
        // user verification -- {END} --

        res.render("PostProperty", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email });

    } catch (e) {
        // if user is not logged in , render to login page !
        res.render("login",
            // throw error
            { err: "Login required" });
    }
})
// Post Property page page GET _-_ {END} _________


// Post Property page page POST _-_ {START} _________
app.post("/PostProperty", upload.fields([{ name: "first_image", maxCount: 1 }, { name: "second_image", maxCount: 1 }, { name: "third_image", maxCount: 1 }, { name: "fourth_image", maxCount: 1 }]), async (req, res) => {

    // user verification -- {START} --
    const userToken = req.cookies.jwt;
    const verifyUser = jwt.verify(userToken, process.env.SECRET_KEY);
    console.log(verifyUser._id);
    const userDetails = await user.findOne({ _id: verifyUser._id });
    // user verification -- {END} --

    // taking data from body !
    var { user_idbyUp,
        uploader_name, uploader_email, uploader_phone,
        owner_name, owner_email, owner_phone,
        house_number, building_name, area_name, city_name, nearest_landmark, home_Type, parking,
        floor, sq_ft, district_name, age,
        first_image, second_image, third_image, fourth_image,
        sellOrRent, offered_at, state_name, country_name,
        rentDeposit } = req.body;

    // testing data ..   
    console.log(user_idbyUp,
        uploader_name, uploader_email, uploader_phone,
        owner_name, owner_email, owner_phone,
        house_number, building_name, area_name, city_name, nearest_landmark, home_Type, parking,
        floor, sq_ft, district_name, age,
        first_image, second_image, third_image, fourth_image,
        sellOrRent, offered_at, state_name, country_name,
        rentDeposit);

    // testing result - images data show undefine (99/100)  

    // .. testing data (END)

    try {

        // testing image data ..   
        console.log(req.files.first_image[0].filename);
        console.log(req.files.second_image[0].filename);
        console.log(req.files.third_image[0].filename);
        console.log(req.files.fourth_image[0].filename);

        // testing result - images data show correctly (100/100)  
        // .. testing image data (END)

        // storing image data in variable ---
        var image_1st_filename = req.files.first_image[0].filename;
        var image_2nd_filename = req.files.second_image[0].filename;
        var image_3rd_filename = req.files.third_image[0].filename;
        var image_4th_filename = req.files.fourth_image[0].filename;
        // ---- 

        const addingProperty = new home({
            // adding all data in nested api to home model schema !
            user_idbyUp,
            UserInformation: {
                uploader_name,
                uploader_email,
                uploader_phone,
                owner_name,
                owner_email,
                owner_phone,
            },
            BuildingInformation: {
                house_number,
                building_name,
                home_Type,
                parking,
                Location: {
                    area_name,
                    nearest_landmark,
                    city_name,
                    district_name,
                    state_name,
                    country_name,
                },
                floor,
                sq_ft,
                age,
                sellOrRent,
                offered_at,
                rentDeposit,
            },
            PropertyImages: {
                first_image: image_1st_filename,  // store image data ..   
                second_image: image_2nd_filename, // store image data ..   
                third_image: image_3rd_filename,  // store image data ..   
                fourth_image: image_4th_filename, // store image data ..   
            },
        });
        // save document --
        const insertHome = await addingProperty.save();
        res.status(200).render("PostProperty", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email, isDone: "done", head: "Home Registered!", message: "Your home registered successfully on our website. We will soon contact you. Thank You! ", type: "success" });
    } catch (e) {
        res.status(400).render("PostProperty", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email, isDone: "done", head: "Cant Register Home!", message: "Due to some internel error we cant upload home details to server. Pleaase try again later. ", type: "error" });
        // if any error throw it -
        console.log(e);
    }
})
// Post Property page page POST _-_ {END} _________

// home Interest page page GET _-_ {START} _________
app.get("/homeInterest", async (req, res) => {

    // taking data from body !
    var { message_add, buying_firstTime,
        active_military_status, plan_on_buying_home } = req.body;

    // testing ..
    console.log(message_add, buying_firstTime,
        active_military_status, plan_on_buying_home);
    // ..

    // getting home data from searchBar---
    const home_id = req.query.home_id;
    const owner = req.query.owner;
    const ownerPhone = req.query.ownerPhone;
    const sellOrRent = req.query.sellOrRent;
    const offered_at = req.query.offered_at;
    const rentDeposit = req.query.rentDeposit;
    const first_image = req.query.first_image;
    const second_image = req.query.second_image;
    const third_image = req.query.third_image;
    const fourth_image = req.query.fourth_image;
    const home_Type = req.query.home_Type;
    const house_number = req.query.house_number;
    const building_name = req.query.building_name;
    const area_name = req.query.area_name;
    const city_name = req.query.city_name;
    const district_name = req.query.district_name;
    const state_name = req.query.state_name;
    const country_name = req.query.country_name;
    const nearest_landmark = req.query.nearest_landmark;
    const sq_ft = req.query.sq_ft;
    const parking = req.query.parking;
    const floor = req.query.floor;
    const age = req.query.age;

    // getting interested user data from searchBar---
    const user_id = req.query.user_id;
    const userName = req.query.userName;
    const userPhone = req.query.userPhone;

    try {
        // user verification -- {START} --
        const userToken = req.cookies.jwt;
        const verifyUser = jwt.verify(userToken, process.env.SECRET_KEY);
        console.log(verifyUser._id);
        const userDetails = await user.findOne({ _id: verifyUser._id })
        // user verification -- {END} --


        const addingHomeInterest = new homeInterest({
            // adding all data in nested api to homeInterest model schema !
            PropertyOwner: {
                owner,
                ownerPhone,
            },
            OwnerPropertyInformation: {
                home_id,
                sellOrRent,
                offered_at,
                home_Type,
                building_name,
                rentDeposit,
                sq_ft,
                parking,
                floor,
                age,
                house_number,
                Locations: {
                    area_name,
                    city_name,
                    state_name,
                    district_name,
                    country_name,
                    nearest_landmark,
                },
                OwnerPropertyImages: {
                    first_image,
                    second_image,
                    third_image,
                    fourth_image,
                },
            },
            InterestedUserInformation: {
                user_id,
                userName,
                userPhone,
            },
            UserAdditionalDeatils: {
                message_add,
                buying_firstTime,
                plan_on_buying_home,
                active_military_status,
            },
        });
        // save document --
        const insertHomeInterest = await addingHomeInterest.save();
        res.render("home", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userEmail: userDetails.email, userPhoto: userDetails.userPhoto });
    } catch (e) {
        // if any error throw it !
        res.send(e);
        console.log(e);
    }
})
// home Interest page page GET _-_ {END} _________


// signup page page POST _-_ {START} _________
app.post("/signup", async (req, res) => {

    // taking data from body !
    var { firstname, signUpPhone, signUpEmail, pass, cpass } = req.body

    // validation {START}
    var err;
    var validatePhone = /^\d{10}$/; // checking email format is correct or not 
    // and checking phone number below too
    var validateEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var phoneLength = signUpPhone.length; // checking length of phone no. is >10 || <10 || 10
    // validation {END}

    // if user misses any filed to filed throw error and render to signup page -- {START} --
    if (!firstname || !signUpEmail || !signUpPhone || !pass || !cpass) {
        // throw an error 
        err = " Please fill full details ! ";
        res.render("signup",
            // rendering error to page !
            { err: err });
        // -- {END} --

        // if user filled email is not match with email format throw error and render to signup page -- {START} --
    } else if (!signUpEmail.match(validateEmail)) {
        // throw an error 
        err = "Please enter Email Id properly";
        res.render("signup", {
            // rendering error to page !
            err: err,
            signUpEmail: signUpEmail,
            firstname: firstname,
            signUpPhone: signUpPhone,
        });
        // -- {END} --

        // if user filled phone number is not match with phone number format throw error and render to signup page -- {START} --
    } else if (!signUpPhone.match(validatePhone) || phoneLength > 10 || phoneLength < 10) {
        // throw an error 
        err = " please enter phone numbers properly ! ";
        res.render("signup", {
            // rendering error to page !
            err: err,
            signUpEmail: signUpEmail,
            firstname: firstname,
            signUpPhone: signUpPhone,
        });
        // -- {END} --

        //  checking if user filled password and confirm password filed match or not -- {START} --
    } else if (pass != cpass) {
        // if not throw an error and render to signup page 
        err = "Password doesn't match with comfirm password !";
        res.render("signup", {
            // rendering error to page !
            err: err,
            signUpEmail: signUpEmail,
            firstname: firstname,
            signUpPhone: signUpPhone,
        });
        // -- {END} --
    } else {
        // if everything is correct 
        try {
            // taking data from body
            const regiUser = new user({
                name: req.body.firstname,
                phone: req.body.signUpPhone,
                email: req.body.signUpEmail,
                password: req.body.pass,
                confirmpassword: req.body.cpass,
            })
            // generate token for user
            const token = await regiUser.generateAuthToken();
            console.log("the token part" + token); // testing token ..
            res.cookie("jwt", token, {
                // make sure that token expire after sometime and user have to re-login !
                expires: new Date(Date.now() + 6000000),
                httpOnly: true
            });
            // console.log(cookie); // testing ..

            // save documenet -
            const registerUser = await regiUser.save();
            console.log("the page part " + registerUser);

            // now firebase otp verification {start}
            res.redirect(`/verifyOtp?phoneNo=${signUpPhone}`); // taking userPhone number for verification
        } catch (e) {
            // if user is already registered then throw an error
            if (e.code == 11000) {
                // throw an error || code 11000 represent in mongodb if any dublicate document present or not !
                err = "This mobile number already registered !";
                res.render("signup", {
                    // rendering error to page !
                    err: err,
                    signUpEmail: signUpEmail,
                    firstname: firstname,
                    signUpPhone: signUpPhone,
                });
            } else {
                // if anything else !!
                console.log(e);
                res.status(400).send(e);
            }
        }
    }

})
// signup page page POST _-_ {END} _________


// login page page POST _-_ {START} _________
app.post("/login", async (req, res) => {

    var err;
    var validPhone = /^\d{10}$/;  // checking phone number format

    // taking data from body !
    var phoneNo = req.body.phone;
    var passwordLog = req.body.password;

    // if user did not fill phone and password filed then throw an error
    if (!phoneNo || !passwordLog) {
        // throw an error
        err = " please enter mobile number and password ";
        res.render("login", {
            // rendering error to page !
            err: err
        });
        // if user filled phone number is not match with phone number format throw error and 
        // render to login page -- {START} --
    } else if (!phoneNo.match(validPhone)) {
        // throw an error
        err = " phone number is invalid ";
        res.render("login", {
            // rendering error to page !
            err: err,
            phone: phoneNo,
        });
        // -- {END} --
    } else {
        try {
            // getting user data from database and decryption of password happen -- {START} -- 
            const gotUser = await user.findOne({ phone: phoneNo });
            const isPasswordMatch = await bcrypt.compare(passwordLog, gotUser.password);
            // -- {END} -

            // after decryting password if it match --
            if (isPasswordMatch) {

                // if user isn't verifyed number with firebase then throw an error and render to verification page !
                if (gotUser.isVerified != true) {
                    console.log("user not verified")
                    // redirecting to page
                    res.redirect(`/verifyOtp?phoneNo=${phoneNo}`); // grab user phone number
                } else {
                    // token part -- {START} --
                    const token = await gotUser.token;
                    console.log(token);
                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + 60000000000),
                        httpOnly: true
                    })
                    // token part -- {END} --
                    res.redirect("/"); // Finally done successful login
                }
            } else {
                // if password not match throw an error
                err = "Wrong Password! Please Try Again.";
                res.render("login",
                    // rendering error to page !
                    { err: err });
            }
        } catch (e) {
            // didn't get registered user data , throw an error
            err = "Entered Mobile number is not registered. Please registered first!";
            res.render("signup",
                // rendering error to page 
                { err: err });
            console.log(e);
        }
    }
})
// login page page POST _-_ {END} _________

app.get("/properties", async (req, res) => {
    try {

        const getHome = await home.find({});
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        const userDetails = await user.findOne({ _id: verifyUser._id });
        res.render("properties", { getHome, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo });


    } catch (e) {
        res.render("login", { err: "Login required" });
    }
})


app.post("/verifyOtp", async (req, res) => {
    try {
        const updateUser = await user.updateOne({ phone: req.body.mobileNo }, { $set: { isVerified: true } });
        console.log(updateUser);
        res.redirect("/login")
    } catch (e) {
        console.log(e);
        res.send(e)
    }
})


app.get("/verifyOtp", async (req, res) => {
    try {
        console.log("im in verify otp")
        var phoneNos = req.query.phoneNo;
        console.log(phoneNos);
        res.render("verifyOtp", { phoneNos })


    } catch (e) {
        res.status(400).send("Got Error")
        console.log(e)
    }
})


app.post("/users", async (req, res) => {
    try {
        const regiUser = new user(req.body);
        console.log(req.body);
        const registerUser = await regiUser.save();
        res.send(registerUser);
    } catch (e) {
        if (e.code == 11000) {
            res.status(400).send("user already present");
            console.log("user already present");
        } else {
            console.log(e);
            res.status(400).send(e);
        }
    }
});

app.post("/logout", (req, res) => {
    try {
        res.clearCookie("jwt")
        res.redirect("/")
    } catch (e) {
        res.status(500).send("error! cant logout")
    }

})

app.get("/deptlogin/", async (req, res) => {
    try {
        res.render("deptlogin");
    } catch (e) {
        res.render(e);
    }
});
app.post("/deptlogin/", async (req, res) => {
    try {
        admin0 = req.body.ad0;
        admin1 = req.body.ad1;
        var err;
        const getCountUsers = await user.count({}, function (err, count) {
            console.log("Number of users:", count);
        })
        const getCountHome = await home.count({}, function (err, countHome) {
            console.log("Number of home:", countHome);
        })
        const getCountMeg = await message.count({}, function (err, countMsg) {
            console.log("Number of msg:", countMsg);
        })
        const getCountinterest = await homeInterest.count({}, function (err, countInterest) {
            console.log("Number of homeInterest:", countInterest);
        })
        if (admin0 == "admin" && admin1 == "admin") {
            res.render("database", { success: "true", count: getCountUsers, countHome: getCountHome, countMsg: getCountMeg, countInterest: getCountinterest });
        } else {
            err = " username or password is wrong, please try again ! ";
            res.render("deptlogin", { success: "false", err: err });
        }
    } catch (e) {
        res.send(e);
        res.render("deptlogin", { success: "false" });
    }
});

app.get("/database/", async (req, res) => {
    try {
        const getCountUsers = await user.count({}, function (err, count) {
            console.log("Number of users:", count);
        })
        const getCountHome = await home.count({}, function (err, countHome) {
            console.log("Number of home:", countHome);
        })
        const getCountMeg = await message.count({}, function (err, countMsg) {
            console.log("Number of msg:", countMsg);
        })
        const getCountinterest = await homeInterest.count({}, function (err, countInterest) {
            console.log("Number of homeInterest:", countInterest);
        })
        res.render("database", { count: getCountUsers, countHome: getCountHome, countMsg: getCountMeg, countInterest: getCountinterest });
    } catch (e) {
        res.render(e);
    }
});

app.get("/database/users", async (req, res) => {
    try {
        const getUsers = await user.find({}).sort({ _id: -1 });
        const getCountUsers = await user.count({}, function (err, count) {
            console.log("Number of users:", count);
        })


        var created_at = req.body.created_at;
        let createdOn = moment(created_at).toString();

        res.render("usersData", { getUsers, count: getCountUsers, moment: moment });
    } catch (e) {
        res.send(e);
    }
});
app.get("/database/users/delete", async (req, res) => {
    try {
        const id = req.query._id;
        const getdelete = await user.findByIdAndRemove(id, function (err) {
            if (err) {
                res.status(200).json({
                    message: 'fail to delete',
                });
            } else {
                res.redirect("/database/users");
            }
        });

    } catch (e) {
        res.send(e);
    }
});

app.get("/database/homes", async (req, res) => {
    try {
        const getHome = await home.find({}).sort({ _id: -1 });
        const getCountHome = await home.count({}, function (err, countHome) {
            console.log("Number of home:", countHome);
        })
        res.render("homeData", { getHome, countHome: getCountHome });
    } catch (e) {
        res.send(e);
    }
});
app.get("/database/homes/delete", async (req, res) => {
    try {
        const id = req.query._id;
        const getdelete = await home.findByIdAndRemove(id, function (err) {
            if (err) {
                res.status(200).json({
                    message: 'fail to delete',
                });
            } else {
                res.redirect("/database/homes");
            }
        });

    } catch (e) {
        res.send(e);
    }
});

app.get("/database/receivedHomeInterests", async (req, res) => {
    try {
        const getHomeInterest = await homeInterest.find({}).sort({ _id: -1 });
        const getCountinterest = await homeInterest.count({}, function (err, countInterest) {
            console.log("Number of homeInterest:", countInterest);
        })
        var requestedAt = req.body.requestedAt;
        let createdOn = moment(requestedAt).toString();
        res.render("homeInt", { getHomeInterest, countInterest: getCountinterest, moment: moment });
    } catch (e) {
        res.send(e);
    }
});

app.get("/database/receivedHomeInterests/delete", async (req, res) => {
    try {
        const id = req.query._id;
        const getdelete = await homeInterest.findByIdAndRemove(id, function (err) {
            if (err) {
                res.status(200).json({
                    message: 'fail to delete',
                });
            } else {
                res.redirect("/database/receivedHomeInterests");
            }
        });

    } catch (e) {
        res.send(e);
    }
});

app.get("/database/messages", async (req, res) => {
    try {
        const getMsg = await message.find({}).sort({ _id: -1 });
        const getCountMsg = await message.count({}, function (err, countMsg) {
            console.log("Number of msg:", countMsg);
        })
        var receivedAt = req.body.receivedAt;
        let createdOn = moment(receivedAt).toString();
        res.render("userDB_Msg", { getMsg, countMsg: getCountMsg, moment: moment });
    } catch (e) {
        res.send(e);
    }
});

app.get("/database/messages/delete", async (req, res) => {
    try {
        const id = req.query._id;
        const getdelete = await message.findByIdAndRemove(id, function (err) {
            if (err) {
                res.status(200).json({
                    message: 'fail to delete',
                });
            } else {
                res.redirect("/database/messages");
            }
        });

    } catch (e) {
        res.send(e);
    }
});

app.get("/database/95s20d0205/users", async (req, res) => {
    try {
        const getUsers = await user.find({}).sort({ _id: -1 });
        res.status(201).send(getUsers);
    } catch (e) {
        res.send(e);
    }
});
app.get("/database/95s20d0205/messages", async (req, res) => {
    try {
        const getMsg = await message.find({}).sort({ _id: -1 });
        res.status(201).send(getMsg);
    } catch (e) {
        res.send(e);
    }
});
app.get("/database/95s20d0205/homes", async (req, res) => {
    try {
        const getHome = await home.find({}).sort({ _id: -1 });
        res.status(201).send(getHome);
    } catch (e) {
        res.send(e);
    }
});
app.get("/database/95s20d0205/receivedHomeInterests", async (req, res) => {
    try {
        const getHomeInterest = await homeInterest.find({}).sort({ _id: -1 });
        res.status(201).send(getHomeInterest);
    } catch (e) {
        res.send(e);
    }
});



app.get("*", async (req, res) => {
    try {
        const userToken = req.cookies.jwt;
        const verifyUser = jwt.verify(userToken, process.env.SECRET_KEY);
        console.log(verifyUser._id);
        const userDetails = await user.findOne({ _id: verifyUser._id })
        res.render("404", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo });

    } catch (e) {
        res.render("404")
    }
});
//server create
app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on 3000 port mode");
});