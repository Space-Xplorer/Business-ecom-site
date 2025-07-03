import React from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function Checkout() {
  const amount = 499; // ₹499 fixed mock amount

  const handlePayment = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/payment/create-order", {
        amount,
      });

      const { id: order_id, amount: orderAmount } = res.data;

      const options = {
        key: "rzp_test_agHUCXSuZ9wOR8", // replace with your actual Razorpay key ID
        amount: orderAmount,
        currency: "INR",
        name: "Erimuga E-Store",
        description: "Mock Checkout",
        order_id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:8080/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyRes.data.success) {
              alert("✅ Payment Successful & Verified!");
            } else {
              alert("❌ Signature verification failed!");
            }
          } catch (error) {
            console.error(error);
            alert("❌ Error verifying payment");
          }
        },
        prefill: {
          name: "Spoorthy",
          email: "spoorthy@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F26A1B",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("❌ Error creating Razorpay order");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="mb-3 text-center">Mock Checkout</h3>
        <p className="text-center mb-4">Proceed to pay ₹{amount}</p>
        <button className="btn btn-success w-100" onClick={handlePayment}>
          Pay ₹{amount}
        </button>
      </div>
    </div>
  );
}
