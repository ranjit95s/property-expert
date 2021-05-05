const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
 UserInformation: {
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
},

  BuildingInformation : {

    home_Type: {
      type: String,
      required: true,
      trim: true,
    },
    sellOrRent: {
      type: String,
      required: true,
      trim: true,
    },
    house_number: {
      type: String,
      required: true,
      trim: true,
    },
    sq_ft: {
      type: Number,
      required: true,
    },
    floor: {
      type: String,
      required: true,
      trim: true,
    },
    building_name: {
      type: String,
      required: true,
      trim: true,
    },
    offered_at: {
      type: Number,
      required: true,
      default: null,
    },
    rentDeposit: {
      type: Number,
      default: null,
    },
    age: {
      type: String,
      required: true,
      trim: true,
    },
    parking: {
      type: String,
      required: true,
      trim: true,
    },
    Location : {
      area_name: {
        type: String,
        required: true,
        trim: true,
      },
      nearest_landmark: {
        type: String,
        required: true,
        trim: true,
      },
      city_name: {
        type: String,
        required: true,
        trim: true,
      },
      district_name: {
        type: String,
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
    },

  },
  PropertyImages: {

    first_image: {
      type: String,
      required: true,
      trim: true,
      data: Buffer,
      contentType: String
    },
    second_image: {
      type: String,
      required: true,
      trim: true,
      data: Buffer,
      contentType: String
    },
    third_image: {
      type: String,
      required: true,
      trim: true,
      data: Buffer,
      contentType: String
    },
    fourth_image: {
      type: String,
      required: true,
      trim: true,
      data: Buffer,
      contentType: String,
    },
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