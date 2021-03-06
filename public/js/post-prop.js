
// render user information in Owner Part {START} !!!

function sameAsAbove() {
    var sameAsAbove = document.querySelector("#switch:checked");
    if (sameAsAbove != null) {
        var uploaderName = document.getElementById("user_name");
        var uploaderContact = document.getElementById("user_phone");
        var uploaderEmail = document.getElementById("user_email");

        var ownerName = document.getElementById("owner_name");
        var ownerContact = document.getElementById("owner_phone");
        var ownerEmail = document.getElementById("owner_email");

        ownerName.value = uploaderName.value;
        ownerContact.value = uploaderContact.value;
        ownerEmail.value = uploaderEmail.value;
        console.log("added")
    }
    else {
        var ownerName = document.getElementById("owner_name");
        var ownerContact = document.getElementById("owner_phone");
        var ownerEmail = document.getElementById("owner_email");

        ownerName.value = "";
        ownerContact.value = "";
        ownerEmail.value = "";
        console.log("removed")
    }
}
// render user information in Owner Part {END} !!!



// below code make sure that very filed filled by user or not .. if not it deactivate submit button else enable submit button {START}
function validateFormInfo() {
    var owner_name = document.getElementById("owner_name").value;
    var owner_phone = document.getElementById("owner_phone").value;
    var owner_email = document.getElementById("owner_email").value;
    var home_Type = document.getElementById("home_Type").value;
    var house_number = document.getElementById("house_number").value;
    var floor = document.getElementById("floor").value;
    var building_name = document.getElementById("building_name").value;
    var sq_ft = document.getElementById("sq_ft").value;
    var parkingSpace = document.getElementById("parkingSpace").value;
    var nearest_landmark = document.getElementById("nearest_landmark").value;
    var age = document.getElementById("age").value;
    var area_name = document.getElementById("area_name").value;
    var city_name = document.getElementById("city_name").value;
    var state_name = document.getElementById("state_name").value;
    var country_name = document.getElementById("country_name").value;
    var firstImage = document.getElementById("image").value;
    var secondImage = document.getElementById("image2").value;
    var thirdImage = document.getElementById("image3").value;
    var fourthImage = document.getElementById("image4").value;
    var sellOrRent = document.getElementById("amount_value");

    var submit_two = document.getElementById("submit");
    // check if file is image or not -
    var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    // check if phone number format is right -
    var phoneno = /^\d{10}$/;

    if (owner_name == null || owner_phone == null || owner_phone == null || owner_email == null ||
        home_Type == null || house_number == null || floor == "null" ||
        building_name == null || sq_ft == null || parkingSpace == null ||
        nearest_landmark == null || age == null || area_name == null ||
        city_name == null || state_name == null || country_name == null ||
        firstImage == null || secondImage == null || thirdImage == null ||
        fourthImage == null || owner_name == "" ||
        owner_phone == "" || owner_phone == "" || owner_email == "" ||
        home_Type == "" || house_number == "" || floor == "" ||
        building_name == "" || sq_ft == "" || parkingSpace == "" ||
        nearest_landmark == "" || age == "" || area_name == "" ||
        city_name == "" || state_name == "" || country_name == "" ||
        firstImage == "" || secondImage == "" || thirdImage == "" ||
        fourthImage == "") {


    var errMessage = document.getElementById("message");
        errMessage.innerHTML = '<div class="alert alert-warning" role="alert"> Note: All details are required! Please fill all details.Then you can able to enter ammount of sell / rent.</div > ';
        sellOrRent.setAttribute("disabled", true);
        submit_two.setAttribute("disabled", true);
    } 
    else if (!allowedExtensions.exec(firstImage) || !allowedExtensions.exec(secondImage) || !allowedExtensions.exec(thirdImage) || !allowedExtensions.exec(firstImage)) {
        var errMessage = document.getElementById("message");
        errMessage.innerHTML = '<div class="alert alert-warning" role="alert"> Note: Please upload only jpg, jpeg and png images! Then you can able to enter ammount of sell/rent.</div>';
        sellOrRent.setAttribute("disabled", true);
        submit_two.setAttribute("disabled", true);
    } 
    else if (!owner_phone.match(phoneno)) {
        var errMessage = document.getElementById("message");
        errMessage.innerHTML = `<div class="alert alert-warning" role="alert"> Note: Owner's mobile number not entered properly. Please enter a valid mobile number. Then you can able to enter ammount of sell/rent.</div>`;
        sellOrRent.setAttribute("disabled", true);
        submit_two.setAttribute("disabled", true);
    } 
    else {
        var errMessage = document.getElementById("message");
        errMessage.innerHTML = ``;
        sellOrRent.removeAttribute("disabled");
        submit_two.removeAttribute("disabled");
    }
}
// below code make sure that very filed filled by user or not .. if not it deactivate submit button else enable submit button {START}

// next button
function next(currentNum) {
    if (!currentNum == 0) {
        var currentDiv = "div" + currentNum;
        var nextNum = currentNum + 1;
        var nextDiv = "div" + nextNum;
        var current = document.getElementById(currentDiv);
        var next = document.getElementById(nextDiv);
        current.classList.remove("active_div");
        next.classList.toggle("active_div");

        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}
// back button
function back(currentNum) {
    if (!currentNum <= 0) {
        var currentDiv = "div" + currentNum;
        var preNum = currentNum - 1;
        var preDiv = "div" + preNum;

        var current = document.getElementById(currentDiv);
        var previous = document.getElementById(preDiv);

        current.classList.remove("active_div");
        previous.classList.toggle("active_div")
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}

