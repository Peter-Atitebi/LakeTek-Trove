import React from 'react'
import PropTypes from 'prop-types';

const ManyProductsDetailsDialog = ({ open, onClose, products }) => {
  return (
    <div>ManyProductsDetailsDialog</div>
  )
}

ManyProductsDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
};

export default ManyProductsDetailsDialog