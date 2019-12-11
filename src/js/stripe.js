/* eslint-disable no-undef */
import $ from "jquery";

//START STRIPE PAYMENT

let pmmkaraoke = 1500,
  pmmblackparty = 1000,
  pmmpicnic = 1000,
  pmmbrunch = 1000,
  chld = 500,
  space = 10000;

let pmmTotal = [];

let toValidate = $("#numberOfTickets, #purchase"),
  valid = false;

toValidate.keyup(function() {
  if ($(this).val().length > 0) {
    $(this).data("valid", true);
  } else {
    $(this).data("valid", false);
  }
  toValidate.each(function() {
    if ($(this).data("valid") == true) {
      valid = true;
    } else {
      valid = false;
    }
  });
  if (valid === true) {
    $("input[type=submit]").prop("disabled", false);
  } else {
    $("input[type=submit]").prop("disabled", true);
  }
});

const stripe = "pk_test_obzu76S8L0GFvqkXbKn204a2";
export function stripeMethod() {
  let handler = StripeCheckout.configure({
    // eslint-disable-line no-undef
    key: stripe,
    image: "https://stripe.com/img/documentation/checkout/marketplace.png",
    locale: "auto",
    zipCode: true,
    billingAddress: true,
    token: async token => {
      // Pass the received token to our Firebase function
      ticketHandler(token);
    }
  });

  $("#ticketBundleBtn").on("click", e => {
    e.preventDefault();

    let tixQuanity = $("#numberOfBundleTickets").val();
    let tixType = "bundle";

    if (tixType == "bundle") {
      if (tixQuanity == "1" || tixQuanity == "2" || tixQuanity == "3") {
        // Open Checkout with further options:
        handler.open({
          name: "PMM Weekend 2020",
          description: "PMM Weekend Passes",
          amount: 3000 * tixQuanity
        });
      } else {
        alert(
          "You can only purchase 3 weekend bundles per transaction, please contact the committee if more is needed."
        );
      }
    }
  });

  $("#ticketBtn").on("click", e => {
    e.preventDefault();

    let tixQuanity = $("#numberOfTickets").val();
    let tixType = $("#purchase").val();

    console.log(
      $("#purchase")
        .find("option:selected")
        .attr("name")
    );

    if (tixType == "pmmkaraoke") {
      handler.open({
        name: "PMM Weekend 2020",
        description: "PMM Karaoke Party Tickets",
        amount: 1500 * tixQuanity
      });
    }
    if (tixType == "pmmblackparty") {
      handler.open({
        name: "PMM Weekend 2020",
        description: "PMM All Black Party Tickets",
        amount: 1000 * tixQuanity
      });
    }
    if (tixType == "pmmpicnic") {
      handler.open({
        name: "PMM Weekend 2020",
        description: "2nd Annual PMM Picnic Tickets",
        amount: 1000 * tixQuanity
      });
    }
    if (tixType == "pmmbrunch") {
      handler.open({
        name: "PMM Weekend 2020",
        description: "PMM Sunday Brunch Tickets",
        amount: 1000 * tixQuanity
      });
    }
    if (tixType == "space") {
      // Open Checkout with further options:
      handler.open({
        name: "PMM Weekend 2020",
        description: "PMM Picnic Tent Space",
        amount: 10000 * tixQuanity
      });
    }
    if (tixType == "chld") {
      handler.open({
        name: "PMM Picnic",
        description: "Children Tickets",
        amount: 500 * tixQuanity
      });
    }

    //----------------------------------------------------------------
    //IF MORE THAN ONE EVENT IS SELECTED, CALCULATE THE TOTAL FOR PAYMENT
    $("#purchase :selected").each(function(i, sel) {
      if ($(sel).val() == "pmmkaraoke") {
        pmmTotal.push(pmmkaraoke * tixQuanity);
      }
      if ($(sel).val() == "pmmblackparty") {
        pmmTotal.push(pmmblackparty * tixQuanity);
      }
      if ($(sel).val() == "pmmpicnic") {
        pmmTotal.push(pmmpicnic * tixQuanity);
      }
      if ($(sel).val() == "pmmbrunch") {
        pmmTotal.push(pmmbrunch * tixQuanity);
      }
      if ($(sel).val() == "chld") {
        pmmTotal.push(chld * tixQuanity);
      }
      if ($(sel).val() == "space") {
        pmmTotal.push(space * tixQuanity);
      }

      const pmmSum = pmmTotal.reduce((a, b) => a + b, 0);

      handler.open({
        name: "PMM Weekend 2020",
        description: "PMM Weekend Event Bundle",
        amount: pmmSum
      });
    });
    //----------------------------------------------------------------
  });

  // Close Checkout on page navigation
  window.addEventListener("popstate", () => {
    handler.close();
  });
}

//https://script.google.com/macros/s/AKfycbzpoIJKFXh1a4tTu9Doar_O8UQcXvq6OYMNSAR-1g/exec

let ticketHandler = (token, args) => {
  const pmmSum = pmmTotal.reduce((a, b) => a + b, 0);
  let tixQuanity = $("#numberOfTickets").val();
  let tixType = $("#purchase").val();
  let eventNames = $("#purchase")
    .find("option:selected")
    .attr("name");

  let tixData = {
    ticketType: tixType.toString(),
    ticketQuanity: tixQuanity.toString(),
    eventName: eventNames.toString(),
    pmmTotal: pmmSum,
    token,
    args
  };

  fetch("http://localhost:5000/api/charge/tickets/pmmticketpayment", {
    method: "POST",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
      //Authorization: "Bearer" + stripe
    },
    body: JSON.stringify(tixData)
  })
    .then(res => {
      res.json();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    })
    .catch(error => {
      return Error("Error:", error);
    });

  // if (tixType == "pmmkaraoke") {
  //   if (tixQuanity == 1) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmkaraoke/1", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         // Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(tixData)
  //     })
  //       .then(function(data) {
  //         console.log("Request success: ", data);
  //       })
  //       .catch(function(error) {
  //         console.log("Request failure: ", error);
  //       });

  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 2) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmkaraoke/2", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 3) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmkaraoke/3", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 4) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmkaraoke/4", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 5) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmkaraoke/5", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   }
  // }
  // if (tixType == "pmmblackparty") {
  //   if (tixQuanity == 1) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmblackparty/1", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 2) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmblackparty/2", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 3) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmblackparty/3", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 4) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmblackparty/4", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 5) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmblackparty/5", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   }
  // }
  // if (tixType == "pmmpicnic") {
  //   if (tixQuanity == 1) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmpicnic/1", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 2) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmpicnic/2", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 3) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmpicnic/3", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 4) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmpicnic/4", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 5) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmpicnic/5", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   }
  // }
  // if (tixType == "pmmbrunch") {
  //   if (tixQuanity == 1) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmbrunch/1", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 2) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmbrunch/2", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 3) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmbrunch/3", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 4) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmbrunch/4", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 5) {
  //     return fetch("http://localhost:5000/api/charge/tickets/pmmbrunch/5", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // .then((res) => {
  //     //   res.json()
  //     // })
  //     // .then((data) => {})
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   }
  // }
  // if (tixType == "space") {
  //   if (tixQuanity == 1) {
  //     return fetch("http://localhost:5000/api/api/charge/tickets/tntsp/1", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // const data = await res.json();
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 2) {
  //     return fetch("http://localhost:5000/api/api/charge/tickets/tntsp/2", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // const data = await res.json();
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 3) {
  //     return fetch("http://localhost:5000/api/api/charge/tickets/tntsp/3", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // const data = await res.json();
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   }
  // }
  // if (tixType == "chld") {
  //   if (tixQuanity == 1) {
  //     return fetch("http://localhost:5000/api/api/charge/tickets/chld/1", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // const data = await res.json();
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 2) {
  //     return fetch("http://localhost:5000/api/api/charge/tickets/chld/2", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // const data = await res.json();
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 3) {
  //     return fetch("http://localhost:5000/api/api/charge/tickets/chld/3", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // const data = await res.json();
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   }
  // }
  // if (tixType == "bundle") {
  //   if (tixQuanity == 1) {
  //     return fetch("http://localhost:5000/api/api/charge/tickets/bundle/1", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // const data = await res.json();
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 2) {
  //     return fetch("http://localhost:5000/api/api/charge/tickets/bundle/2", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // const data = await res.json();
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   } else if (tixQuanity == 3) {
  //     return fetch("http://localhost:5000/api/api/charge/tickets/bundle/3", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer" + stripe
  //       },
  //       body: JSON.stringify(token, args)
  //     });
  //     // const data = await res.json();
  //     // data.body = JSON.parse(data.body);
  //     // return data;
  //   }
  // }

  // if (tixType != "bundle" && tixType != "chld" && tixType != "space" && tixType != "pmmbrunch" && tixType != pmmpicnic && tixType != pmmblackparty && tixType != pmmkaraoke){
  //   console.log('----PMM TOTAL HAS BEEN REACHED---')
  //   return fetch("http://localhost:5000/api/api/charge/tickets/pmmtotal", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer" + stripe
  //     },
  //     body: JSON.stringify(token, args)
  //   });
  // }
};

//END STRIPE
