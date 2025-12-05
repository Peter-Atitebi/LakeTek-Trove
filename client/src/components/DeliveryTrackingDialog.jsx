//  src/components/DeliveryTrackingDialog.jsx

import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { SERVER_BASE_URL } from "../utils/api";
import { useAuthentication } from "../../../hooks/useAuthentication";

const DeliveryTrackingDialog = ({ open, onClose, order, onUpdate }) => {
  const [status, setStatus] = useState("Pending");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const { session } = useAuthentication();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (order && order.delivery) {
      setStatus(order.delivery?.status || "Pending");
      setEstimatedDeliveryDate(order.delivery?.estimatedDeliveryDate || "");
      setNotes(order.delivery?.notes || "");
    } else {
      setStatus("Pending");
      setEstimatedDeliveryDate("");
      setNotes("");
    }
    setError(null);
  }, [order]);

  const handleUpdate = async () => {
    if (order) {
      if (!session?.token) {
        setError("You must be logged in to perform this action.");
        return;
      }
      if (!estimatedDeliveryDate) {
        setError("Estimated delivery date is required.");
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const response = await axios.put(
          `${SERVER_BASE_URL}/tracking/update/${order.id}`,
          {
            status,
            estimatedDeliveryDate,
            notes,
            orderId: order.id,
          },
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );
        setLoading(false);
        onUpdate(response.data);
        onClose();
      } catch (error) {
        setLoading(false);
        setError(`Failed to update delivery tracking: ${error.message}`);
        console.error("Error updating delivery tracking:", error);
      }
    } else {
      setError("Order not found.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Delivery Tracking</DialogTitle>
      <DialogContent>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Dispatched">Dispatched</MenuItem>
            <MenuItem value="In Transit">In Transit</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Estimated Delivery Date"
          type="date"
          fullWidth
          margin="normal"
          value={estimatedDeliveryDate}
          onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            htmlInput: {
              min: today,
            },
          }}
        />
        <TextField
          label="Notes"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUpdate} disabled={loading} color="primary">
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeliveryTrackingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default DeliveryTrackingDialog;
