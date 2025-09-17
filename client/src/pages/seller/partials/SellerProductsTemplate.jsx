// src/pages/seller/partials/SellerProductsTemplate.jsx

import AddProduct from "../../../components/products/addProduct";

const SellerProductsTemplate = () => {
  const handleOnClose = () => {};

  const handleOnSave = () => {};

  const handleOpenAddProduct = () => {};

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-4">Products</h1>
          </div>
          <div>
            <button
              onClick={handleOpenAddProduct}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Add product */}
      <AddProduct
        onClose={handleOnClose}
        onSave={handleOnSave}
        open={handleOpenAddProduct}
      />
    </>
  );
};

export default SellerProductsTemplate;
