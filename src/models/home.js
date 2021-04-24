const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
  uploader_name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  uploader_phone: {
    type: Number,
    required: true,
    trim: true,
    minlength: 10,
  },
  uploader_email: {
    type: String,
    required: true,
    trim: true,
  },
  owner_name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  owner_phone: {
    type: Number,
    required: true,
    trim: true,
    minlength: 10,
  },
  owner_email: {
    type: String,
    required: true,
    trim: true,
  },
  house_number: {
    type: String,
    required: true,
    trim: true,
  },
  building_name: {
    type: String,
    required: true,
    trim: true,
  },
  area_name: {
    type: String,
    required: true,
    trim: true,
  },
  city_name: {
    type: String,
    required: true,
    trim: true,
  },
  nearest_landmark: {
    type: String,
    required: true,
    trim: true,
  },
  home_Type: {
    type: String,
    required: true,
    trim: true,
  },
  parking: {
    type: String,
    required: true,
    trim: true,
  },
  floor: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: String,
    required: true,
    trim: true,
  },
  sq_ft: {
    type: Number,
    required: true,
    
  },
  state_name: {
    type: String,
    required: true,
  },
  country_name: {
    type: String,
    required: true,
  },
  first_image: {
    type: String,
    required: true,
    trim: true,
  },
  second_image: {
    type: String,
    required: true,
    trim: true,
  },
  third_image: {
    type: String,
    required: true,
    trim: true,
  },
  fourth_image: {
    type: String,
    required: true,
    trim: true,
  },
  sellOrRent: {
    type: String,
    required: true,
    trim: true,

  },
  offered_at: {
    type: Number,
    required: true,
    default : null,
  },
  rentDeposit: {
    type: Number,
    default : null,
  },
  receivedAt: {
    type: String,
    default: new Date(),
  },
  isVerified: {
    type: Boolean,
    default: false,
}
});

const home = new mongoose.model("home", homeSchema);

module.exports = home;