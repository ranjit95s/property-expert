const mongoose = require("mongoose");



const homeInterestSchema = mongoose.Schema({
  PropertyOwner: {
    owner: {
      type: String,
      trim: true,
    },
    ownerPhone: {
      type: String,
      trim: true,
    },
  },

  OwnerPropertyInformation: {

    home_id: {
      type: String,
      trim: true,
    },
    house_number: {
      type: String,
      trim: true,
    },
    building_name: {
      type: String,
      trim: true,
    },
    home_Type: {
      type: String,
      trim: true,
    },
    parking: {
      type: String,
      trim: true,
    },
    floor: {
      type: String,
      trim: true,
    },
    age: {
      type: String,
      trim: true,
    },
    sq_ft: {
      type: Number,

    },
    sellOrRent: {
      type: String,
      trim: true,

    },
    offered_at: {
      type: Number,
      default: null,
    },
    rentDeposit: {
      type: Number,
      default: null,
    },
    Locations: {
      area_name: {
        type: String,
        trim: true,
      },
      city_name: {
        type: String,
        trim: true,
      },
      nearest_landmark: {
        type: String,
        trim: true,
      },
      state_name: {
        type: String,
      },
      district_name: {
        type: String,
      },
      country_name: {
        type: String,
      },

    },
    OwnerPropertyImages: {
      first_image: {
        type: String,
        trim: true,
      },
      second_image: {
        type: String,
        trim: true,
      },
      third_image: {
        type: String,
        trim: true,
      },
      fourth_image: {
        type: String,
        trim: true,
      },
    },
  },

  InterestedUserInformation: {
    user_id: {
      type: String,
      trim: true,
    },
    userName: {
      type: String,
      trim: true,
    },
    userPhone: {
      type: String,
      trim: true,
    },
  },
  UserAdditionalDeatils: {

    message_add: {
      type: String,
      trim: true,
    },
    buying_firstTime: {
      type: String,
      trim: true,
      default: 'No',
    },
    plan_on_buying_home: {
      type: String,
      trim: true,
      default: 'I Am Not Sure',
    },
    active_military_status: {
      type: String,
      trim: true,
      default: 'No',
    },
  },


  requestedAt: {
    type: String,
    default: new Date(),
  },


});

homeInterestSchema.set('timestamps', true);

const homeInterest = new mongoose.model("homeInterest", homeInterestSchema);

module.exports = homeInterest;
