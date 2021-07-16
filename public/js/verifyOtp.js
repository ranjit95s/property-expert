
// firebase OTP VERIFICATION ___

$(document).ready(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyCvBL2vw_hem-FXAYZj-tv8lieMXUa4ndE",
    authDomain: "property-expert-95s.firebaseapp.com",
    projectId: "property-expert-95s",
    storageBucket: "property-expert-95s.appspot.com",
    messagingSenderId: "281563211565",
    appId: "1:281563211565:web:f08fd7effcc793ffb255a4",
    measurementId: "G-9SDS5DBSJD"
  };
  firebase.initializeApp(firebaseConfig);

  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "invisible",
      callback: function (response) {
        console.log("rechaptcha resolved");
      },
    }
  );
  onSignInSubmit();
});

function onSignInSubmit() {
  var sendBtn = document.getElementById("send");
  var sendBtno = document.getElementById("sendo");
  var verifyBtn = document.getElementById("verify");
  var verifyBtnz = document.getElementById("gggg");
  var submitBtn = document.getElementById("submit");
  var otpInput = document.getElementById("otp");
  var otpInputs = document.getElementById("otps");

  $("#send").on("click", function () {
    var phoneNo = "+91" + $("#num").val();
    console.log(phoneNo);
    var sendBtno = document.getElementById("sendo");
    sendBtno.value = "Please Wait...";
    var appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNo, appVerifier)
      .then(function (confirmationResult) {
        window.confirmationResult = confirmationResult;
        coderesult = confirmationResult;
        console.log(coderesult);
        swal(
          "OTP Sent",
          "OTP is sent successfully to your number. Please check your mobile phone.",
          "success"
        );
        otpInput.classList.remove("hidden");
        sendBtn.classList.toggle("hidden");
        verifyBtn.classList.remove("hidden");
        sendBtno.value = "Send OTP";
      })
      .catch(function (error) {
        console.log(error.message);
        swal(
          "Can't Send OTP",
          "OTP cannot be send at this moment please try again after some time. Sorry...!",
          "error"
        );

        sendBtno.value = "Send OTP";
      });
  });
  $("#verify").on("click", function () {
    verifyBtnz.value = "Please Wait...";
    let phoneNo = "";
    var code = $("#otps").val();
    console.log(code);
    confirmationResult
      .confirm(code)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        console.log("Successfull");

        verifyBtn.value = "Verify OTP";
        swal(
          "Verified!",
          "OTP verified successfully! Please click on submit. Thank You..",
          "success"
        );
        otpInput.classList.toggle("hidden");
        verifyBtn.classList.toggle("hidden");
        submitBtn.classList.remove("hidden");
      })
      .catch((error) => {
        console.log("wrong captcha");
        swal("Wrong OTP!", "Entered OTP is wrong please try again!", "error");
        verifyBtn.value = "Verify OTP";
        sendBtn.classList.remove("hidden");
        otpInput.classList.toggle("hidden");
        verifyBtn.classList.toggle("hidden");

        verifyBtn.value = "Verify OTP";
      });
  });
}




jQuery.event.special.touchstart = {
  setup: function (_, ns, handle) {
    this.addEventListener("touchstart", handle, { passive: !ns.includes("noPreventDefault") });
  }
};
