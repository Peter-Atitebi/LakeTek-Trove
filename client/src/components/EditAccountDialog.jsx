import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { SERVER_BASE_URL } from "../utils/api";
import useAuthentication from "../hooks/useAuthentication";

const EditAccountDialog = ({ open, onClose, onSave }) => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { session } = useAuthentication();
  const [success, setSuccess] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);

  useEffect(() => {
    if (session?.user) {
      setAccountDetails(session.user);
    }
  }, [session]);

  const updateAccount = async () => {
    setProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.patch(
        `${SERVER_BASE_URL}/auth/update/${accountDetails.id}`,
        accountDetails,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );

      const updatedUser = response.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setAccountDetails(updatedUser);
      setSuccess(true);
      setProcessing(false);
      setTimeout(() => {
        setSuccess(false);
        setError(null);
        onSave(updatedUser);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message);
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <div className="flex justify-between">
          <span>Edit Account</span>
          <span className="text-sm text-gray-500">
            {accountDetails?.role === "user" ? "Buyer" : accountDetails?.role}
          </span>
        </div>
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4 min-w-[400px]">
        {processing && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {success ? (
          <p className="text-green-500">Account updated successfully!</p>
        ) : (
          <div className="flex flex-col gap-4">
            <TextField
              label="Name"
              value={accountDetails?.name || ""}
              onChange={(e) =>
                setAccountDetails({ ...accountDetails, name: e.target.value })
              }
            />
            <TextField
              label="Email"
              value={accountDetails?.email || ""}
              onChange={(e) =>
                setAccountDetails({ ...accountDetails, email: e.target.value })
              }
              margin="dense"
            />
            <TextField
              label="Role"
              disabled
              fullWidth
              value={accountDetails?.role || ""}
              margin="dense"
            />
            {accountDetails?.role === "seller" && (
              <>
                <hr />
                <h4>Your Store Details</h4>
                <TextField
                  label="Store Name"
                  fullWidth
                  value={accountDetails?.store?.name || ""}
                  onChange={(e) =>
                    setAccountDetails({
                      ...accountDetails,
                      store: {
                        ...accountDetails.store,
                        name: e.target.value,
                      },
                    })
                  }
                  margin="dense"
                />
              </>
            )}

            <TextField
              label="Description"
              type="text"
              fullWidth
              value={accountDetails?.store?.description || ""}
              onChange={(e) =>
                setAccountDetails({
                  ...accountDetails,
                  store: {
                    ...accountDetails.store,
                    description: e.target.value,
                  },
                })
              }
              margin="dense"
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>

        <Button onClick={updateAccount} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditAccountDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditAccountDialog;
