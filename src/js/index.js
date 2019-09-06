import _ from "lodash";
import message from "./message";
import "../styles/index.scss";

(async() => {

	var button = document.querySelector("#submit-button");
	
      const { token } = await fetch(
        "http://localhost:5000/api/payment/client_token"
      ).then(res => res.json());
      braintree.dropin.create(
        {
          authorization: token,
          container: "#dropin-container"
        },
        (createErr, instance) => {
          button.addEventListener("click", () => {
            instance.requestPaymentMethod(async (err, payload) => {
              const params = {
                payment_method_nonce: payload.nonce
              };
              const headers = {
                Accept: "application/json",
                "Content-Type": "application/json"
              };
              fetch("http://localhost:5000/api/payment/checkout", {
                method: "POST",
                body: JSON.stringify(params),
                headers,
              });
              console.log(payload.nonce);
            });
          });
        }
      );
})();

 if (module.hot) {
     module.hot.accept('./message.js', function() {
       console.log('Accepting the updated printMe module!');
       message();
     });
   }