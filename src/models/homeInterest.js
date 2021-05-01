const mongoose = require("mongoose");



const homeInterestSchema = mongoose.Schema({
    home_id: {
        type: String,
        trim: true,
    },
    owner: {
        type: String,
        trim: true,
    },
    owner: {
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
    state_name: {
        type: String,
    },
    country_name: {
        type: String,
    },
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
    requestedAt: {
        type: String,
        default: new Date(),
    },
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
    message_add: {
        type: String,
        trim: true,
    },
    buying_firstTime: {
        type: String,
        trim: true,
    },
    plan_on_buying_home: {
        type: String,
        trim: true,
    },
    active_military_status: {
        type: String,
        trim: true,
    },


});

homeInterestSchema.set('timestamps', true);

const homeInterest = new mongoose.model("homeInterest", homeInterestSchema);

module.exports = homeInterest;







{/* <div class="info-sec">
<hr>
<div class="header-top-info">
  <div class="price-sec">
    <div class="price"><i class="fas fa-rupee-sign"></i> 10,0000 <span><small> 3bhk | 3000 sq-ft</small></span>
    </div>
  </div>
  <div class="loc-sec">
    <div class="location"><i class="fas fa-map-marker-alt"></i> Location :</div>
    <div class="location-full"> 201 , yashoda building , 1st floor , jari mari maata mandir , <br> kaneri , thane ,
      maharashtra , india </div>
  </div>
</div>
<hr>
<!-- image gallary -->
<h2 class="heading"> <span>  Property Images </span></h2>
<div class="body">
  <div class="wrapper">
  <div class="gallery">
    <div class="image"><span><img src="/images/property/1.jpg" alt=""></span></div>
    <div class="image"><span><img src="/images/agents/2.jpg" alt=""></span></div>
    <div class="image"><span><img src="/images/agents/3.jpg" alt=""></span></div>
    <div class="image"><span><img src="/images/agents/4.jpg" alt=""></span></div>

  </div>
</div>
<div class="preview-box">
  <div class="details">
    <span class="title">Image <p class="current-img"></p> of <p class="total-img"></p></span>
    <span class="icon fas fa-times"></span>
  </div>
  <div class="image-box">
    <div class="slide prev"><i class="fas fa-angle-left"></i></div>
    <div class="slide next"><i class="fas fa-angle-right"></i></div>
    <img src="" alt="">
  </div>
</div>
<div class="shadow"></div> 

</div>



<!-- image gallary -->

<div class="overview-sec">
  <div class="overview"> Overviews :</div>
  <div class="clear-over">
    
    <div class="timeadd over">Time On PropertyExpert.Com : <span> 15 may </span></div>
    <div class="owner-list over">
      listed by : <span> Ranjit Kumar Suryawanshi </span>
    </div>
  </div>
    <div class="complete-info">
      <div class="details-cell">

        <div class="detail-cell">
          <div class="info-head"><i class="fas fa-home lolololo"></i> Home Type</div>
          <div class="info-heads">3bhk</div>
        </div>
        <div class="detail-cell">
          <div class="info-head"><i class="fas fa-home lolololo"></i> Home Type</div>
          <div class="info-heads">3bhk</div>
        </div>
        <div class="detail-cell">
          <div class="info-head"><i class="fas fa-home lolololo"></i> Home Type</div>
          <div class="info-heads">3bhk</div>
        </div>
        <div class="detail-cell">
          <div class="info-head"><i class="fas fa-home lolololo"></i> Home Type</div>
          <div class="info-heads">3bhk</div>
        </div>
        <div class="detail-cell">
          <div class="info-head"><i class="fas fa-home lolololo"></i> Home Type</div>
          <div class="info-heads">3bhk</div>
        </div>
        <div class="detail-cell">
          <div class="info-head"><i class="fas fa-home lolololo"></i> Home Type</div>
          <div class="info-heads">3bhk</div>
        </div>
      </div>
    </div>
    
          <div class="questionArrive">
    
            <div class="question">Have a question about this home? Connect with a local buyer’s agent who advertises with
              PropertyExpert.Com </div>
            <input type="button" value="Get a call">
    
          </div>
</div>





<form action="/home" method="post" class="form">
  <div class="header-form">Interested in touring and buying/Renting Home?</div>
  <div class="user_infos">
    <div class="user-info">
      <div class="userinfo">Name</div>
      <input type="text" class="input_filed" name="owner" placeholder="enter name" value="Ranjit Kumar Suryawanshi" readonly>
    </div>
    <div class="user-info">
      <div class="userinfo">Phone</div>
      <input type="text" class="input_filed" placeholder="enter phone" value="8329470132" readonly>
    </div>
    <div class="user-info">
      <div class="userinfo">Email</div>
      <input type="text" class="input_filed" placeholder="enter email" value="ranjit95s@gmail.com" readonly>
    </div> */}