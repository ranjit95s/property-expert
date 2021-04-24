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

//setting path


var moment = require('moment');
const staticpath = path.join(__dirname, "../public");
const temPath = path.join(__dirname, "../templates/views");

const krnababaPath = path.join(__dirname, "../css/style.css");
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images/property/");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "__" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: storage });

// , fileFilter: function (req, res, cd) {
//     checkFiletype(file, cd);
// }

// function checkFiletype(file, cd) {
//     // allow ext
//     const filetypes = /jpeg|jpg|png|gif/;
//     //check ext
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const minetype = filetypes.test(file.minetype);

//     if (minetype && extname) {
//         return cd(null, true);
//     } else {
//         cd('err : images only')
//     }

// }

// console.log(process.env.SECRET_KEY);
//routing
//app.get (path, callback)
app.get("/", async (req, res) => {

    try {
        const getHome = await home.find({}).sort({ _id: -1 }).limit(10);
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        const userDetails = await user.findOne({ _id: verifyUser._id })
        res.render("index", { getHome, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email });
    } catch (e) {
        const getHome = await home.find({}).sort({ _id: -1 }).limit(10);
        res.render("index" , { getHome });
    }
    // const getProperties = await home.find({}).sort({ _id: -1 }).limit(10);
});


app.get("/home", async (req, res) => {
    // console.log(`this is the cookie awesome ${req.cookies.jwt}`);
    try {
        var id = req.query.h_id;
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        const userDetails = await user.findOne({ _id: verifyUser._id });
        const getHome = await home.find({ _id: id }).limit(1);
        console.log(getHome.length);

        var receivedAt = req.body.receivedAt
        let createdOn = moment(receivedAt).toString();


        if (getHome.length == 1) {
            res.render("home", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email, foundHome: true, moment: moment , getHome });
        } else {
            res.render("home", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userEmail: userDetails.email, userPhoto: userDetails.user_photo, foundHome: false });
        }
    } catch (e) {
        res.render("login", {
            err: "login first"
        });
        res.send(e);
        // console.log(e);
    }
});

app.post("/homeInterest", async (req, res) => {
    var id = req.query.h_id;
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verifyUser);
    const userDetails = await user.findOne({ _id: verifyUser._id });
    const getHome = await home.find({ _id: id }).limit(1);

    const message_add = req.body.message_add;
    const buying_firstTime = req.body.buying_firstTime;
    const plan_on_buying_home = req.body.plan_on_buying_home;
    const active_military_status = req.body.active_military_status;

    // const home_id = req.query.home_id;
    // const owner = req.query.owner;
    // const sellOrRent = req.query.sellOrRent;
    // const offered_at = req.query.offered_at;
    // const first_image = req.query.first_image;
    // const second_image = req.query.second_image;
    // const third_image = req.query.third_image;
    // const fourth_image = req.query.fourth_image;
    // const home_Type = req.query.home_Type;
    // const area_name = req.query.area_name;
    // const city_name = req.query.city_name;
    // const state_name = req.query.state_name;
    // const country_name = req.query.country_name;
    // const nearest_landmark = req.query.nearest_landmark;
    // const sq_ft = req.query.sq_ft;
    // const parking = req.query.parking;
    // const floor = req.query.floor;
    // const age = req.query.age;
    // const user_id = req.query.user_id;
    // const user_name = req.query.user_name;
    // const user_phone = req.query.user_phone;

    // console.log(parking);
    // console.log(message_add);
    

    try {

        const updateUser = await homeInterest.updateMany({ $set: {
            message_add,
            buying_firstTime,
            plan_on_buying_home,
            active_military_status,
        } })
        console.log(updateUser);
        // const addingHomeInterest = new homeInterest({
        //     // home_id,
        //     // owner,
        //     // sellOrRent,
        //     // offered_at,
        //     // first_image,
        //     // second_image,
        //     // third_image,
        //     // fourth_image,
        //     // home_Type,
        //     // area_name,
        //     // city_name,
        //     // state_name,
        //     // country_name,
        //     // nearest_landmark,
        //     // sq_ft,
        //     // parking,
        //     // floor,
        //     // age,
        //     // user_id,
        //     // user_name,
        //     // user_phone,
        //     message_add,
        //     buying_firstTime,
        //     plan_on_buying_home,
        //     active_military_status
        // });




        // const insertHomeInterest = await addingHomeInterest.save();



        res.status(200).render("home", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email, interestSubmitted: true, getHome });



    } catch (e) {
        res.send(e);
        console.log(e);
    }
})

app.get("/aboutmore", async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        const userDetails = await user.findOne({ _id: verifyUser._id })
        res.render("aboutmore", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email });
    } catch (e) {
        res.render("aboutmore");
    }
});

app.get("/contact", async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        const userDetails = await user.findOne({ _id: verifyUser._id });
        res.render("contact", {user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email });
    } catch (e) {
        res.render("contact");
    }
});


app.post("/contact", auth , async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verifyUser);
    const userDetails = await user.findOne({ _id: verifyUser._id });

          const addNewMsg = new message ({
              name: req.body.nameM,
              email: req.body.phoneM,
              message: req.body.message,
          });

          const newMessage = await addNewMsg.save();

        //   console.log(newMessage);
          res.render("contact", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, success: "true" })
    

  } catch(e) {
      res.send(e);
      res.render("login", { err: "Login required" ,  success : "false" });
      console.log(e);
  }
})




app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});


app.get("/PostProperty", async (req, res) => {
    try {

        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        const userDetails = await user.findOne({ _id: verifyUser._id });
        res.render("PostProperty", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email });

    } catch (e) {
        res.render("login", { err: "Login required" });
    }
})

app.post("/PostProperty", upload.fields([{ name: "first_image", maxCount: 1 }, { name: "second_image", maxCount: 1 }, { name: "third_image", maxCount: 1 }, { name: "fourth_image", maxCount: 1 }]), async (req, res) => {


    const userToken = req.cookies.jwt;
    const verifyUser = jwt.verify(userToken, process.env.SECRET_KEY);
    console.log(verifyUser._id);
    const userDetails = await user.findOne({ _id: verifyUser._id });




    var { uploader_name, uploader_email, uploader_phone, owner_name, owner_email, owner_phone, house_number, building_name, area_name, city_name, nearest_landmark, home_Type, parking, floor, sq_ft, age, first_image, second_image, third_image, fourth_image, sellOrRent, offered_at, state_name, country_name, rentDeposit } = req.body;
    console.log(uploader_name, uploader_email, uploader_phone, owner_name, owner_email, owner_phone, house_number, building_name, area_name, city_name, nearest_landmark, home_Type, parking, floor, sq_ft, age, first_image, second_image, third_image, fourth_image, sellOrRent, offered_at, state_name, country_name, rentDeposit);
    try {
        // // // // // // // const uploadsFolder = path.join(__dirname, "../public/images/property");
        // const image_1st = uploadsFolder + req.files.first_image[0].filename;
        // const image_2nd = uploadsFolder + req.files.second_image[0].filename;
        // const image_3rd = uploadsFolder + req.files.third_image[0].filename;
        // const image_4th = uploadsFolder + req.files.fourth_image[0].filename;

        console.log(req.files.first_image[0].filename);
        console.log(req.files.second_image[0].filename);
        console.log(req.files.third_image[0].filename);
        console.log(req.files.fourth_image[0].filename);

        var image_1st_filename = req.files.first_image[0].filename;
        var image_2nd_filename = req.files.second_image[0].filename;
        var image_3rd_filename = req.files.third_image[0].filename;
        var image_4th_filename = req.files.fourth_image[0].filename;


        const addingProperty = new home({
            uploader_name,
            uploader_email,
            uploader_phone,
            owner_name,
            owner_email,
            owner_phone,
            house_number,
            building_name,
            area_name,
            city_name,
            nearest_landmark,
            home_Type,
            parking,
            floor,
            sq_ft,
            age,
            first_image: image_1st_filename,
            second_image: image_2nd_filename,
            third_image: image_3rd_filename,
            fourth_image: image_4th_filename,
            sellOrRent,
            offered_at,
            state_name,
            country_name,
            rentDeposit
        });


        const insertHome = await addingProperty.save();


        res.status(200).render("PostProperty", {  user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email , isDone: "done", head: "Home Registered!", message: "Your home registered successfully on our website. We will soon contact you. Thank You! ", type: "success"  });
    } catch (e) {
        res.status(400).render("PostProperty", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userPhoto: userDetails.user_photo, userEmail: userDetails.email , isDone: "done", head: "Cant Register Home!", message: "Due to some internel error we cant upload home details to server. Pleaase try again later. ", type: "error" });

        console.log(e);
    }
})


app.get("/homeInterest", async (req, res) => {

    var { message_add, buying_firstTime, active_military_status, plan_on_buying_home } = req.body;
    console.log(message_add, buying_firstTime, active_military_status, plan_on_buying_home);
    // const message_add = req.body.message_add;
    // const buying_firstTime = req.body.buying_firstTime;
    // const plan_on_buying_home = req.body.plan_on_buying_home;
    // const active_military_status = req.body.active_military_status;

    // console.log(message_add, buying_firstTime, plan_on_buying_home, active_military_status);

    const home_id = req.query.home_id;
    const owner = req.query.owner;
    const sellOrRent = req.query.sellOrRent;
    const offered_at = req.query.offered_at;
    const first_image = req.query.first_image;
    const second_image = req.query.second_image;
    const third_image = req.query.third_image;
    const fourth_image = req.query.fourth_image;
    const home_Type = req.query.home_Type;
    const area_name = req.query.area_name;
    const city_name = req.query.city_name;
    const state_name = req.query.state_name;
    const country_name = req.query.country_name;
    const nearest_landmark = req.query.nearest_landmark;
    const sq_ft = req.query.sq_ft;
    const parking = req.query.parking;
    const floor = req.query.floor;
    const age = req.query.age;
    const user_id = req.query.user_id;
    const userName = req.query.userName;
    const userPhone = req.query.userPhone;


    try {

        const userToken = req.cookies.jwt;
        const verifyUser = jwt.verify(userToken, process.env.SECRET_KEY);
        console.log(verifyUser._id);
        const userDetails = await user.findOne({ _id: verifyUser._id })



        const addingHomeInterest = new homeInterest({
            home_id,
            owner,
            sellOrRent,
            offered_at,
            first_image,
            second_image,
            third_image,
            fourth_image,
            home_Type,
            area_name,
            city_name,
            state_name,
            country_name,
            nearest_landmark,
            sq_ft,
            parking,
            floor,
            age,
            user_id,
            userName,
            userPhone,
            message_add,
            buying_firstTime,
            plan_on_buying_home,
            active_military_status

        });

        const insertHomeInterest = await addingHomeInterest.save();
        res.render("home", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userEmail: userDetails.email, userPhoto: userDetails.userPhoto});



    } catch (e) {
        res.send(e);
        console.log(e);
    }
})


app.get("/receivedHomeInterests", async (req, res) => {
    try {
      const getHomeInterest = await homeInterest.find({}).sort({ _id: -1 });
      res.status(201).send(getHomeInterest);
    } catch (e) {
      res.send(e);
    }
  });
  












app.post("/signup", upload.fields([{ name: "user_photo", maxCount: 1 }]), async (req, res) => {
    var { user_photo } = req.body;
    console.log(user_photo);

    var { firstname , signUpPhone , signUpEmail , pass , cpass } = req.body
    var err ;
    var validatePhone = /^\d{10}$/;
    var validateEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var phoneLength = signUpPhone.length;

    if (!firstname || !signUpEmail || !signUpPhone || !pass || !cpass) {
        err = " Please fill full details ! ";
        res.render("signup" , {err : err});

    }  else if (!signUpEmail.match(validateEmail)) {
        err = "Please enter Email Id properly";
        res.render("signup", {
          err: err,
          signUpEmail : signUpEmail,
          firstname : firstname,
          signUpPhone : signUpPhone,
        });
    }
    else if (!signUpPhone.match(validatePhone) || phoneLength > 10 || phoneLength < 10) {
        err = " please enter phone numbers properly ! ";
        res.render("signup" , {
            err : err,
            signUpEmail : signUpEmail,
            firstname : firstname,
            signUpPhone : signUpPhone,
        });
    } else if (pass != cpass) {
        err = "Password doesn't match with comfirm password !";
        res.render("signup" , {
            err : err,
            signUpEmail : signUpEmail,
            firstname : firstname,
            signUpPhone : signUpPhone,
        });
    } else {

        try {
    
    
            console.log(req.files.user_photo[0].filename);
    
    
            var image_user_photo = req.files.user_photo[0].filename;
    
    
            
                const regiUser = new user({
                    name: req.body.firstname,
                    phone: req.body.signUpPhone,
                    user_photo: image_user_photo,
                    email: req.body.signUpEmail,
                    password : req.body.pass,
                    confirmpassword: req.body.cpass,
                })
    
                const token = await regiUser.generateAuthToken();
                console.log("the token part" + token);
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 6000000),
                    httpOnly: true
                });
                // console.log(cookie);
    
                const registerUser = await regiUser.save();
                console.log("the page part " + registerUser);
                res.redirect(`/verifyOtp?phoneNo=${signUpPhone}`);
    
            
        } catch (e) {
            if (e.code == 11000) {
                err = "This mobile number already registered !";
                res.render("signup" , {
                    err : err,
                    signUpEmail : signUpEmail,
                    firstname : firstname,
                    signUpPhone : signUpPhone,
                });
            } else {
                console.log(e);
                res.status(400).send(e);
            }
        }
    }

})
app.post("/login", async (req, res) => {

    var err;
    var validPhone = /^\d{10}$/;
    var phoneNo = req.body.phone;
    var passwordLog = req.body.password;

    if(!phoneNo || !passwordLog) {
        err = " please enter mobile number and password ";
        res.render("login" , {
            err : err
        });
    } else if (!phoneNo.match(validPhone)) {
        err = " phone number is invalid ";
        res.render("login" , {
            err : err,
            phone : phoneNo,
        });
    } else {
        try {
            const gotUser = await user.findOne({ phone: phoneNo });
            const isPasswordMatch = await bcrypt.compare(passwordLog, gotUser.password);
            if (isPasswordMatch) {
              if (gotUser.isVerified != true) {
                console.log("user not verified")
                // err = "Your account is not verified yet. Please contact support."
                // res.render("verifyOtp", { mobile_no: phoneNo, verifyMsg: "Your Mobile number is not verified yet. Please Verify Mobile Number." });
                res.redirect(`/verifyOtp?phoneNo=${phoneNo}`);
              }
              else {
                const token = await gotUser.token;
                console.log(token);
                res.cookie("jwt", token, {
                  expires: new Date(Date.now() + 60000000000),
                  httpOnly: true
                })
                // err = "Logged in Successfully!";
                // res.render("login", { err: err });
                res.redirect("/");
              }
            } else {
              err = "Wrong Password! Please Try Again.";
              res.render("login", { err: err});
            }
        } catch (e) {
            err = "Entered Mobile number is not registered. Please registered first!";
            res.render("signup", { err: err, });
            console.log(e);
        }
    }
})

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
      console.log (updateUser);
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




//getting api datas

app.get("/users", async (req, res) => {
    try {
        const getUsers = await user.find({}).sort({ _id: -1 });
        res.status(201).send(getUsers);
    } catch (e) {
        res.send(e);
    }
});
app.get("/messages", async (req, res) => {
    try {
        const getMsg = await message.find({}).sort({ _id: -1 });
        res.status(201).send(getMsg);
    } catch (e) {
        res.send(e);
    }
});
app.get("/homes", async (req, res) => {
    try {
        const getHome = await home.find({}).sort({ _id: -1 });
        res.status(201).send(getHome);
    } catch (e) {
        res.send(e);
    }
});


//server create

// app.listen(port, () => {
//     console.log("server is running on " + port);
// });

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on 3000 port mode");
  });