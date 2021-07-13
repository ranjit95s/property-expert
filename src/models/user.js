const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  user_photo: {
    data: Buffer,
    contentType: String
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: Number,
    required: true,
    minlength: 10,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  created_at: {
    type: String,
    default: new Date(),
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    required: true,
  },
  // tokens: [{
  //   token:
  //   {
  //     type: String,
  //     required: true,
  //   }

  // }],
});

//password hashing
userSchema.pre("save", async function (next) {
  // console.log(`the current password is ${this.password}`);
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 7);
    // console.log(`the current password is ${this.password}`);
  }
  next();
});


// generating token
userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    // this.tokens = this.tokens.concat({token:token});
    this.token = token;
    console.log(token);
    await this.save();
    return token;
  } catch (e) { }
};




const user = new mongoose.model("users", userSchema);

module.exports = user;


// const securePassword = async (password) =>{
//     const passwordHash = await bcrypt.hash(password, 7);
//   console.log(passwordHash);
//   const passwordHashh = await bcrypt.compare("devendra1234567890", passwordHash);
//   console.log(passwordHashh);
// }

// securePassword("devendra1234567890")









// // userSchema.methods.generateAuthToken = async function () {
// //   try {
// //     console.log(this._id);
// //     const token = jwt.sign({ _id: this._id.toString()}, "giggcjbsxjknoiheoihxeoihxibxjdbxjhvdcuhguegxiuehoxihewnd");
// //     this.tokens = this.tokens.concat({token:token});
// //     console.log(token);
// //     await this.save();
// //     return token;
// //   } catch (e) { }
// // };