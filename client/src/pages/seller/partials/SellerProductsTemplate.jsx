// src/pages/seller/partials/SellerProductsTemplate.jsx

import { useState } from "react";
import ProductsTable from "../../../components/products/ProductsTable";

const SellerProductsTemplate = () => {
  return (
    <>
      <div>
        <div className="flex justify-between items-center px-4">
          <div>
            <h1 className="text-2xl font-bold mb-4">Seller Products</h1>
          </div>
        </div>
      </div>

      {/* Table */}
      <ProductsTable />
    </>
  );
};

export default SellerProductsTemplate;
