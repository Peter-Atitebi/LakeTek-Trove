import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import useAuthentication from "../hooks/useAuthentication";
import axios from "axios";
import { SERVER_BASE_URL } from "../utils/api";

const EditAddressDialog = ({
  open,
  onClose,
  onSavedAndSuccess,
  shippingAddress,
  setShippingAddress,
}) => {
  const { session } = useAuthentication();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateAddress = async () => {
    setProcessing(true);
    setError(null);

    axios
      .post(
        `${SERVER_BASE_URL}/auth/update-shipping-address`,
        { shippingAddress },
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      )
      .then((response) => {
        const user = JSON.parse(localStorage.getItem("user"));
        user.shippingAddress = response.data?.shippingAddress;
        localStorage.setItem("user", JSON.stringify(user));
        setSuccess(true);
        setProcessing(false);

        setTimeout(() => {
          setSuccess(false);
          onSavedAndSuccess(response.data);
          setError(null);
          setShippingAddress(response.data);
        }, 3000);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Failed to update address.");
        setProcessing(false);
      });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Shipping Address</DialogTitle>
      <DialogContent>
        {processing && (
          <div className="flex justify-center my-4">
            <CircularProgress />
            <p className="ml-4">Updating address...</p>
          </div>
        )}

        {success && !processing && (
          <div className="flex justify-center my-4">
            <h2 className="text-green-600 my-4">
              Address updated successfully!
            </h2>
          </div>
        )}

        {error && !processing && (
          <div className="flex justify-center my-4">
            <h2 className="text-red-600 my-4">{error}</h2>
          </div>
        )}

        {!processing && !success && !error && (
          <>
            <TextField
              label="Address"
              fullWidth
              value={shippingAddress?.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              margin="dense"
            />

            <TextField
              label="Country"
              fullWidth
              value={shippingAddress?.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              margin="dense"
            />

            <TextField
              label="City"
              fullWidth
              value={shippingAddress?.city}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  city: e.target.value,
                })
              }
              margin="dense"
            />

            <TextField
              label="State"
              fullWidth
              value={shippingAddress?.state}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  state: e.target.value,
                })
              }
              margin="dense"
            />

            <TextField
              label="Postal Code"
              fullWidth
              value={shippingAddress?.postalCode}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  postalCode: e.target.value,
                })
              }
              margin="dense"
            />

            <TextField
              label="Phone"
              fullWidth
              value={shippingAddress?.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              margin="dense"
            />
          </>
        )}
      </DialogContent>

      {!success && (
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={updateAddress} color="primary" disabled={processing}>
            Save Address
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

EditAddressDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSavedAndSuccess: PropTypes.func.isRequired,
  shippingAddress: PropTypes.shape({
    id: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    country: PropTypes.string,
    postalCode: PropTypes.string,
    phone: PropTypes.string,
    zipCode: PropTypes.string,
    pinCode: PropTypes.number,
  }),
  setShippingAddress: PropTypes.func,
};

export default EditAddressDialog;
