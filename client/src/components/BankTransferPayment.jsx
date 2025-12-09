import React from "react";

const BankTransferPayment = () => {
  return (
      <div className="mt-6">
                       <h3 className="mb-4 text-lg font-semibold">
                         Bank Transfer Instructions
                       </h3>
                       <p>
                         Please transfer the total amount to the following bank
                         account:
                       </p>
                       <ul className="my-4 list-disc list-inside">
                         <li>Bank: </li>
                         <li>Account Name: </li>
                         <li>Account Number: </li>
                         <li>SWIFT Code: </li>
                       </ul>
                       <button
                         className="mt-4 flex w-full items-center justify-center rounded-1gbg-blue-700 px-5 py-2.5
     text-sn font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300dark:bg-blue
     dark:hover:bg-green-700"
                       >
                         Confirm Bank Transfer
                       </button>
                     </div>
  )
}

export default BankTransferPayment