const mangoose = require("mongoose");

require('dotenv').config()
// creating a database !!!
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_CONN2 || DB_CONN22, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
})
    .then(() => {
        console.log("connection to db successfull!")
    }).catch((e) => {
        console.log("db not connect due to = " + e)
    })

module.exports = mongoose










































