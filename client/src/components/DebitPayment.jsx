import React from "react";

const DebitPayment = () => {
  return (
    <>
      <div className="mb-G grid grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="full_name"
            className="mb-2 block text-sm font-medium [text-gray-900 dark:text-white"
          >
            Full name (as displayed on card)*
          </label>
          <input
            type="text"
            id="full_name"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5
    text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Bonnie Green"
            required
          />
        </div>
        {/* Card Number */}
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="card number input"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Card number*
          </label>
          <input
            type="text"
            id="card-number-input"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5  
    text-sm text-gray-900 focus:border-green-500 focus:ring-green-500  
    dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="xxxx-xxxx-xxxx-xxxx"
            required
          />
        </div>

        {/* Expiration */}
        <div>
          <label
            htmlFor="card-expiration-input"
            className="mb-2 block text-se font-medium text-gray-900 dark:text-white"
          >
            Card expiration*
          </label>
          <input
            type="text"
            id="card-expiration-input"
            className="block w-full rounded-ig border  
    text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  
    border-gray-300 bg-gray-50 p-2.5  
    dark:border-gray-680 dark:bg-gray-700 dark:text-white"
            placeholder="12/23"
            required
          />
        </div>

        {/* CVV */}
        <div>
          <label
            htmlFor="cvv-input"
            className="mb-2 block text-sn font-medium text-gray-900 dark:text-white"
          >
            CVV*
          </label>
          <input
            type="number"
            id="cvv-input"
            className="block w-full rounded-1g border border-gray-300 bg-gray-50 p-2.5  
    text-sm text-gray-900 focus:border-green-500 focus:ring-green-500  
    dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="..."
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 flex w-full items-center justify-center rounded-1gbg-blue-700 px-5 py-2.5
      text-sn font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300dark:bg-blue
      dark:hover:bg-green-700"
      >
        Pay Now
      </button>
    </>
  );
};

export default DebitPayment;
