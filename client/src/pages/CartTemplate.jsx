// src/pages/CartTemplate.jsx

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AppLayout from "../components/AppLayout";
import AppFooter from "../components/footer/AppFooter";
import { useCart } from "../hooks/CartContext";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

const CartTemplate = () => {
  const { cartItems, clearCart, removeFromCart, cartTotalAmount } = useCart();
  const navigate = useNavigate();
  const [userCountry, setUserCountry] = useState("NG");

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        console.log("Detected country:", data.country_code);
        setUserCountry(data.country_code || "NG");
      } catch (error) {
        console.error("Error detecting country:", error);
        setUserCountry("NG");
      }
    };

    detectCountry();
  }, []);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return { label: "Out of Stock", color: "error" };
    } else if (stock > 0 && stock <= 20) {
      return { label: "Low Stock", color: "warning" };
    } else {
      return { label: "In Stock", color: "success" };
    }
  };

  return (
    <>
      <AppLayout>
        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: { xs: "1.75rem", md: "2.125rem" },
              }}
            >
              <ShoppingCartOutlinedIcon fontSize="large" />
              Shopping Cart
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </Typography>
          </Box>

          {/* Check if cart is empty */}
          {cartItems.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 8 },
                textAlign: "center",
                bgcolor: "grey.50",
                borderRadius: 3,
              }}
            >
              <ShoppingCartOutlinedIcon
                sx={{ fontSize: { xs: 60, md: 80 }, color: "grey.300", mb: 2 }}
              />
              <Typography
                variant="h5"
                gutterBottom
                fontWeight="medium"
                sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
              >
                Your cart is empty
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Add items to get started
              </Typography>
              <Button variant="contained" size="large">
                Continue Shopping
              </Button>
            </Paper>
          ) : (
            <>
              {/* Desktop Table View */}
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "grey.200",
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "grey.50" }}>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Product
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" fontWeight="bold">
                            Price
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" fontWeight="bold">
                            Quantity
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" fontWeight="bold">
                            Total
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" fontWeight="bold">
                            Action
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => {
                        const stockStatus = getStockStatus(item.stock);
                        return (
                          <TableRow
                            key={item.id}
                            sx={{
                              "&:hover": { bgcolor: "grey.50" },
                              transition: "all 0.2s",
                            }}
                          >
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                {item.image ? (
                                  <CardMedia
                                    component="img"
                                    image={item.image}
                                    alt={item.name}
                                    sx={{
                                      width: 80,
                                      height: 80,
                                      borderRadius: 2,
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  <Box
                                    sx={{
                                      width: 80,
                                      height: 80,
                                      bgcolor: "grey.200",
                                      borderRadius: 2,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <ShoppingCartOutlinedIcon
                                      sx={{ fontSize: 30, color: "grey.400" }}
                                    />
                                  </Box>
                                )}
                                <Box>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="medium"
                                  >
                                    {item.name}
                                  </Typography>
                                  <Chip
                                    label={stockStatus.label}
                                    size="small"
                                    color={stockStatus.color}
                                    sx={{ mt: 0.5 }}
                                  />
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body1" fontWeight="medium">
                                {formatCurrency(item.price, userCountry)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body1" fontWeight="medium">
                                {item.quantity}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography
                                variant="h6"
                                fontWeight="bold"
                                color="primary"
                              >
                                {formatCurrency(
                                  item.price * item.quantity,
                                  userCountry
                                )}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                onClick={() => removeFromCart(item.id)}
                                color="secondary"
                                size="small"
                                sx={{
                                  border: "1px solid",
                                  borderColor: "secondary.main",
                                }}
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Mobile Card View */}
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <Stack spacing={2}>
                  {cartItems.map((item) => {
                    const stockStatus = getStockStatus(item.stock);
                    return (
                      <Card
                        key={item.id}
                        elevation={0}
                        sx={{
                          border: "1px solid",
                          borderColor: "grey.200",
                          borderRadius: 2,
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            {item.image ? (
                              <CardMedia
                                component="img"
                                image={item.image}
                                alt={item.name}
                                sx={{
                                  width: 100,
                                  height: 100,
                                  borderRadius: 2,
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: 100,
                                  height: 100,
                                  bgcolor: "grey.200",
                                  borderRadius: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <ShoppingCartOutlinedIcon
                                  sx={{ fontSize: 40, color: "grey.400" }}
                                />
                              </Box>
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="subtitle1"
                                fontWeight="medium"
                                gutterBottom
                              >
                                {item.name}
                              </Typography>
                              <Chip
                                label={stockStatus.label}
                                size="small"
                                color={stockStatus.color}
                              />
                            </Box>
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Price
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {formatCurrency(item.price, userCountry)}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Quantity
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {item.quantity}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 2,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Total
                            </Typography>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              color="primary"
                            >
                              {formatCurrency(
                                item.price * item.quantity,
                                userCountry
                              )}
                            </Typography>
                          </Box>

                          <Button
                            onClick={() => removeFromCart(item.id)}
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            startIcon={<DeleteOutlineIcon />}
                          >
                            Remove Item
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              </Box>

              {/* Cart Summary and Actions */}
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  border: "1px solid",
                  borderColor: "grey.200",
                  borderRadius: 2,
                  bgcolor: "grey.50",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Cart Total
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {formatCurrency(cartTotalAmount, userCountry)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", sm: "row" },
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    <Button
                      onClick={clearCart}
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteOutlineIcon />}
                      size="large"
                      fullWidth={window.innerWidth < 600}
                    >
                      Clear Cart
                    </Button>

                    <Button
                      onClick={handleCheckout}
                      variant="contained"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      size="large"
                      fullWidth={window.innerWidth < 600}
                      sx={{ minWidth: 200 }}
                    >
                      Proceed to Checkout
                    </Button>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Container>
      </AppLayout>

      <AppFooter />
    </>
  );
};

export default CartTemplate;
