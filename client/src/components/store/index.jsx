//src/components/store/index.jsx
import PropTypes from "prop-types";

const Store = ({storeDetail, products}) => {
  return <div>Store Component</div>;
}

Store.propTypes = {
  storeDetail: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
};
export default Store;
