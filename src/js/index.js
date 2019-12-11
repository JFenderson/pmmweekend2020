// import _ from "lodash";
import message from "./message";
import "../styles/styles.scss";
import firebaseFunct from "./firebase";
import {stripeMethod} from './stripe';
// import stripeMethod from './stripe';
import $ from "jquery";
import M from "materialize-css";


$(document).ready(() => {
  $(".pageloader")
    .delay(1000)
    .fadeOut("slow");
  $("body").removeClass("hidden");

  M.Sidenav.init($(".sidenav"));
  M.Tabs.init($(".tabs"));
  M.FormSelect.init($("select"));

  //navbar
  // $(".sidenav").sidenav();
  //nav bar to stick.
  $(window).scroll(function() {
    //if you hard code, then use console
    //.log to determine when you want the
    //nav bar to stick.
    if ($(window).scrollTop() >= 40) {
      $("#mainNav").addClass("sticky");
    } else {
      $("#mainNav").removeClass("sticky");
    }
  });

  $("ul.navbar-nav")
    .find("a")
    .click(function(e) {
      e.preventDefault();
      var target = this.hash;
      var $target = $(target);
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $target.offset().top //no need of parseInt here
          },
          900,
          "swing",
          function() {
            window.location.hash = target;
          }
        );
    });
  //end navbar

  //START IMAGE GALLERY
  firebaseFunct();


  //END PHOTO GALLERY

  //NODEMAILER FOR CONTACT FORM
  function phoneFormatter() {
    $("#number").on("input", function() {
      let number = $(this)
        .val()
        .replace(/[^\d]/g, "");
      if (number.length == 7) {
        number = number.replace(/(\d{3})(\d{4})/, "$1-$2");
      } else if (number.length == 10) {
        number = number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
      }
      $(this).val(number);
    });
  }

  $(phoneFormatter);

  // $.getScript("./stripe.js", () => {
  //   console.log('got the stripe file');
  // });


  //stripe starter
  stripeMethod();
  //stripe ends

  //MEMBER SIGNUP TO ADD TO BE ADDED TO DATABASE
  $("#memberSubmit").click(e => {
    e.preventDefault();

    let name = $("#memberName").val();
    let email = $("#memberEmail").val();
    let number = $("#memberNumber").val();
    let location = $("#memberLocation").val();
    let confirm = $("#memberConfirm").val();

    let yes = "yes";
    let no = "no";

    if($("#memberConfirm").val().toLowerCase() === yes.toLowerCase()){
      confirm = 'yes';
    }else if ($("#memberConfirm").val().toLowerCase() === no.toLowerCase()) {
      confirm = "no";
    }else{
      confirm = 'N/A';
    }


    fetch("http://localhost:5000/api/members/signup", {
      method: "POST", // or 'PUT'
      body: JSON.stringify({
        name: name,
        email: email,
        phoneNumber: number,
        location: location,
        confirm: confirm
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        res.json();
        setTimeout(() => {
          window.location.reload();
        }, 10);
      })
      .catch(error => {
        return Error("Error:", error);
      });
  });
  //END MEMBER SIGNUP

  //start contact
  $("#contactSubmit").click(e => {
    e.preventDefault();

    let name = $("#contactName").val();
    let email = $("#contactEmail").val();


    fetch("http://localhost:5000/api/contact/signup", {
      method: "POST", // or 'PUT'
      body: JSON.stringify({
        name: name,
        email: email,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        res.json();
        setTimeout(() => {
          window.location.reload();
        }, 10);
      })
      .catch(error => {
        return Error("Error:", error);
      });
  });
  //end contact

  // (async () => {})();

  // COUNTDOWN

  // The date you want to count down to
  // var dateStr = "4/13/2019 12:00";
  // var date = dateStr.split(/\s|\/|:/);
  // var targetDate = new Date(date[2], date[1], date[0], date[3], date[4]);
  let targetDate = new Date("2020/4/16");

  // Other date related variables
  let days;
  let hrs;
  let min;
  let sec;

  /* --------------------------
   * ON DOCUMENT LOAD
   * -------------------------- */
  $(function() {
    // Calculate time until launch date
    timeToLaunch();
    // Transition the current countdown from 0
    numberTransition("#days .number", days, 1000, "easeOutQuad");
    numberTransition("#hours .number", hrs, 1000, "easeOutQuad");
    numberTransition("#minutes .number", min, 1000, "easeOutQuad");
    numberTransition("#seconds .number", sec, 1000, "easeOutQuad");
    // Begin Countdown
    setTimeout(countDownTimer, 1001);
  });

  /* --------------------------
* FIGURE OUT THE AMOUNT OF 
TIME LEFT BEFORE LAUNCH
* -------------------------- */
  function timeToLaunch() {
    // Get the current date
    let currentDate = new Date();

    // Find the difference between dates
    let diffInDate = (currentDate - targetDate) / 1000;
    let diff = Math.abs(Math.floor(diffInDate));

    // Check number of days until target
    days = Math.floor(diff / (24 * 60 * 60));
    sec = diff - days * 24 * 60 * 60;

    // Check number of hours until target
    hrs = Math.floor(sec / (60 * 60));
    sec = sec - hrs * 60 * 60;

    // Check number of minutes until target
    min = Math.floor(sec / 60);
    sec = sec - min * 60;
  }

  /* --------------------------
* DISPLAY THE CURRENT 
COUNT TO LAUNCH
* -------------------------- */
  function countDownTimer() {
    // Figure out the time to launch
    timeToLaunch();

    // Write to countdown component
    $("#days .number").text(days);
    $("#hours .number").text(hrs);
    $("#minutes .number").text(min);
    $("#seconds .number").text(sec);

    // Repeat the check every second
    setTimeout(countDownTimer, 1000);
  }

  /* --------------------------
* TRANSITION NUMBERS FROM 0
TO CURRENT TIME UNTIL LAUNCH
* -------------------------- */
  function numberTransition(id) {
    // Transition numbers from 0 to the final number
    $({ numberCount: $(id).text() });
  }

  // END COUNTDOWN
});

if (module.hot) {
  module.hot.accept("./message.js", function() {
    console.log("Accepting the updated printMe module!");
    message();
  });
}
