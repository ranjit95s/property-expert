const mangoose = require("mongoose");

require('dotenv').config()
// creating a database !!!
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_CONN2 || DB_CONN22, {     useCreateIndex : true,
useNewUrlParser : true,
useUnifiedTopology : true,
useFindAndModify: true})
        .then(connect => console.log('connected to mongodb..'))
        .catch(e => console.log('could not connect to mongodb', e))

module.exports = {mongoose}










































