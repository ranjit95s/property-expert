const mangoose = require("mongoose");

require('dotenv').config()
// creating a database !!!
mangoose.connect(process.env.DB_CONN2, {
    useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useFindAndModify: true
}).then( ()=> {
    console.log("connetion is successful !!!!!!");
} ).catch((e) =>{
    console.log(e);
})













































