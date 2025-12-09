import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/useAuthentication";
import axios from "axios";
import { SERVER_BASE_URL } from "../utils/api";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AppLayout from "../components/AppLayout";
import AppFooter from "../components/footer/AppFooter";
import DisplayErrorMessage from "../components/DisplayErrorMessage";

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { session, signOut } = useAuthentication();

  useEffect(() => {
    const fetchOrder = async () => {
      // Ensure user is authenticated
      if (!session?.token || !session?.user?.id) {
        signOut();
        navigate("/login");
        return;
      }

      // Validate orderId
      if (!orderId || isNaN(orderId)) {
        setError("Invalid order ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${SERVER_BASE_URL}orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );
        setOrder(response.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch order details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (session?.token && orderId) {
      fetchOrder();
    }
  }, [session, navigate, orderId, signOut]);

  // Format price helper
  const formatPrice = (price) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(numPrice)) return "0.00";
    return numPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Display error message
  const displayErrorMessage = () => {
    if (error) {
      <DisplayErrorMessage
        errorMessage={error}
        setErrorMessage={setError}
        type="error"
      />;
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <>
        <AppLayout>
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading order details...</p>
            </div>
          </div>
        </AppLayout>
        <AppFooter />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <AppLayout>{displayErrorMessage()}</AppLayout>
        <AppFooter />
      </>
    );
  }

  // No order found
  if (!order) {
    return (
      <>
        <AppLayout>
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <ReceiptIcon
                className="text-gray-300 mb-4"
                style={{ fontSize: 80 }}
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Order Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find the order you're looking for.
              </p>
              <button
                onClick={() => navigate("/orders")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
              >
                View All Orders
              </button>
            </div>
          </div>
        </AppLayout>
        <AppFooter />
      </>
    );
  }

  return (
    <>
      <AppLayout>
        <div className="max-w-4xl mx-auto p-6">
          {/* Success Header */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4">
              <CheckCircleIcon
                className="text-green-600"
                style={{ fontSize: 60 }}
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Order Confirmed!
                </h1>
                <p className="text-gray-700 text-lg">
                  Thank you for your purchase. Your order has been received and
                  is being processed.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="text-lg font-semibold text-gray-900">
                  #{order.id || order._id || orderId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(order.createdAt || order.orderDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "shipped"
                          ? "bg-purple-100 text-purple-800"
                          : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status
                    ? order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)
                    : "Pending"}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-lg font-semibold text-green-600">
                  ₦{formatPrice(order.totalAmount || order.total)}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          {order.shippingAddress && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <LocalShippingIcon className="text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Shipping Information
                </h2>
              </div>
              <div className="text-gray-700">
                <p className="font-semibold">
                  {order.shippingAddress.fullName || order.shippingAddress.name}
                </p>
                <p>{order.shippingAddress.address}</p>
                {order.shippingAddress.address2 && (
                  <p>{order.shippingAddress.address2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode ||
                    order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name || item.productName}
                      className="w-20 h-20 object-contain rounded border border-gray-200"
                      onError={(e) => {
                        e.target.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /%3E%3C/svg%3E';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.name || item.productName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      ₦{formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ₦{formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  ₦{formatPrice(order.subtotal || order.totalAmount)}
                </span>
              </div>
              {order.shippingCost > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    ₦{formatPrice(order.shippingCost)}
                  </span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">
                    ₦{formatPrice(order.tax)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-xl font-bold pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span className="text-green-600">
                  ₦{formatPrice(order.totalAmount || order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              View All Orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium px-6 py-3 rounded-lg transition"
            >
              Continue Shopping
            </button>
          </div>

          {/* Customer Support Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Need help?</strong> If you have any questions about your
              order, please contact our customer support at{" "}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:underline"
              >
                support@example.com
              </a>{" "}
              or call us at{" "}
              <a
                href="tel:+1234567890"
                className="text-blue-600 hover:underline"
              >
                +123 456 7890
              </a>
              .
            </p>
          </div>
        </div>
      </AppLayout>
      <AppFooter />
    </>
  );
};

export default OrderConfirmation;
