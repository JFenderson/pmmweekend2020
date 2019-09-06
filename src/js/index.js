import _ from "lodash";
import message from "./message";
import "../styles/index.scss";
import braintree from 'braintree';

(async() => {

	var button = document.querySelector("#submit-button");
	
      const { token } = await fetch(
        "http://localhost:5000/client_token"
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
              fetch("http://localhost:5000/checkout", {
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
