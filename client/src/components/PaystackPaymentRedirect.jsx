import React from "react";

const PaystackPaymentRedirect = () => {
  return (
    <div className="mt-6">
      <p>You will be redirected to Paystack to complete your payment.</p>
      <button
        onClick={() => {}}
        className="mt-4 flex w-full items-center justify-center rounded-1gbg-blue-700 px-5 py-2.5  
    text-sn font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300dark:bg-blue  
    dark:hover:bg-green-700"
      >
        Proceed to Paystack
      </button>
    </div>
  );
};

export default PaystackPaymentRedirect;
