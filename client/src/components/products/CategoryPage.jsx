// src/components/products/CategoryPage.jsx
import { useParams } from "react-router-dom";

import AppLayout from "../AppLayout";
import AppFooter from "../footer/AppFooter";

const CategoryPage = () => {
  const { category } = useParams();
  return (
    <>
      <AppLayout></AppLayout>

      {/* footer */}
      <AppFooter />
    </>
  );
};

export default CategoryPage;
