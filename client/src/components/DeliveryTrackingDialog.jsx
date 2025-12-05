import React from 'react'
import PropTypes from 'prop-types';

const DeliveryTrackingDialog = ({ open, onClose, order }) => {
  return <div>DeliveryTrackingDialog</div>;
};

DeliveryTrackingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
};

export default DeliveryTrackingDialog