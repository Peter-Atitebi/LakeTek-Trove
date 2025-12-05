//src/pages/admins/partials/AdminOrders.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { SERVER_BASE_URL } from "../../../utils/api";
import { useAuthentication } from "../../../hooks/useAuthentication";
import truncateText from "../../../hooks/truncateText";
import ManyProductsDetailsDialog from "../../../components/products/ManyProductsDetailsDialog";
import DeliveryTrackingDialog from "../../../components/DeliveryTrackingDialog";
import LoadingSpinnerBody from "../../../components/LoadingSpinnerBody";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import BlockIcon from "@mui/icons-material/Block";

const AdminOrders = () => {
  const { session } = useAuthentication();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]); // Stores filtered orders based on search query
  const [selectedProducts, setSelectedProducts] = useState([]); // Stores selected products for the product details dialog
  const [openProductDialog, setOpenProductDialog] = useState(false); // Controls the visibility of the product details dialog
  const [error, setError] = useState(null); // stores any error message for display
  const [isDialogOpenTracking, setIsDialogOpenTracking] = useState(false); // Controls the visibility of the tracking dialog
  const [selectedOrder, setSelectedOrder] = useState(null); // Stores the selected order for tracking
  const [searchQuery, setSearchQuery] = useState(""); // stores the current search query
  const [isSearching, setIsSearching] = useState(false); // Manages search state

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const lowerSearchQuery = searchQuery.toLowerCase();
      const filtered = orders.filter(
        (order) =>
          order._id.toLowerCase().includes(lowerSearchQuery) ||
          order.customer?.name?.toLowerCase().includes(lowerSearchQuery) ||
          new Date(order.createdAt)
            .toLocaleDateString()
            .includes(lowerSearchQuery)
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [searchQuery, orders]);

  const getOrders = async () => {
    if (session && session.token) {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const res = await axios.get(`${SERVER_BASE_URL}orders/manager`, {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        });
        setOrders(res?.data);
        setFilteredOrders(res?.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please log in to view orders.");
    }
  };

  const handleOpenProductDialog = (order) => {
    if (order?.products && order.products.length > 0) {
      setSelectedProducts(order?.products);
      setOpenProductDialog(true);
    } else {
      alert("No products found for this order.");
    }
  };

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
    setSelectedProducts([]);
  };

  const handleMarkedAsShipped = async (orderId) => {
    console.log(`Marking order ${orderId} as shipped`);
  };

  const handleMarkedAsDelivered = async (order) => {
    if (order) {
      setSelectedOrder(order);
      setIsDialogOpenTracking(true);
    }
  };
 
  const handleUpdateTracking = (delivery) => {
    if (delivery) {
      console.log("Delivery info:", delivery);

      if (orders && orders.length > 0) {
        const updatedOrders = orders.map((order) => {
          if (order.id === delivery.order) {
            order.delivery = delivery;
          }
          return order;
        });
        setOrders(updatedOrders);
      }

      if (filteredOrders && filteredOrders.length > 0) {
        const updatedFilteredOrders = filteredOrders.map((order) => {
          if (order.id === delivery.order) {
            order.delivery = delivery;
          }
          return order;
        });
        setFilteredOrders(updatedFilteredOrders);
      }
      if (selectedOrder && selectedOrder.id === delivery.order) {
        setSelectedOrder({ ...selectedOrder, delivery });
      }
    }
  };

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (session && session.token) {
      setIsSearching(true);
      try {
        const res = await axios.get(`${SERVER_BASE_URL}manager/orders/search`, {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
          params: { query },
        });
        setIsSearching(false);
        setFilteredOrders(res.data);
      } catch (error) {
        console.error("Error searching orders:", error);
        setError("Failed to search orders. Please try again later.");
      } finally {
        setIsSearching(false);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinnerBody />;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-2xl items-center h-full">
        <Typography variant="h6" gutterBottom color="error">
          Something went wrong. Please try again later.
        </Typography>

        <Typography variant="body1" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => setError(null)}
        >
          Clear
        </Button>
      </div>
    );
  }

  if (filteredOrders.length === 0 && !isSearching) {
    return (
      <div className="text-center py-4 text-2xl items-center h-full">
        <Typography variant="h6" gutterBottom color="error">
          No orders found.
        </Typography>
      </div>
    );
  }

  const showDeliveryStatus = (delivery) => {
    if (delivery) {
      console.log(delivery?.status);
      switch (delivery?.status) {
        case "Dispatched":
          return (
            <span className="text-green-500 space-x-2">
              <span>Dispatched</span>
              <WarehouseIcon />
            </span>
          );

        case "In Transit":
          return (
            <span className="text-yellow-500 space-x-2">
              <span>In Transit</span>
              {/* <FontAwesomeicon icon={faTruck} /> */}
              <LocalShippingIcon />
            </span>
          );
        case "Delivered":
          return (
            <span className="text-blue-500 space-x-2">
              <span>Delivered</span>
              <CheckBoxIcon />
            </span>
          );
        case "Cancelled":
          return (
            <span className="text-red-500 space-x-2">
              <span>Cancelled</span>
              <BlockIcon />
            </span>
          );
        default:
          return (
            <span className="text-gray-500">
              <span>Pending</span>
              <PendingActionsIcon />
            </span>
          );
      }
    } else {
      return (
        <span className="text-gray-500">
          <span>Pending</span>
          <PendingActionsIcon />
        </span>
      );
    }
  };

  return (
    <div>
      <h1>Admin Orders</h1>
      <p>Here you can manage all orders.</p>
    </div>
  );
};

export default AdminOrders;
