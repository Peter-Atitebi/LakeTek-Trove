// src/components/products/ManyProductsDetailsDialog.jsx

import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";
import truncateText from "../../hooks/truncateText";
import { formatCurrency } from "../../utils/formatCurrency";

const ManyProductsDetailsDialog = ({ open, onClose, products }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>Product Details</DialogTitle>
      {products && products.length > 0 ? (
        <DialogContent>
          <TableContainer component={Paper}>
            <Table aria-label="products table">
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Subcategory</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Discount (%)</TableCell>
                  <TableCell align="right">Price Before</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((item, index) => {
                  const { product } = item;
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <a
                          href={
                            product && product.storeId
                              ? `/store/${product.storeId}/?productId=${product.id}`
                              : "#"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            width="50"
                            height="50"
                            className="hover:cursor-pointer"
                          />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          <a
                            href={
                              product && product.storeId
                                ? `/store/${product.storeId}/?productId=${product.id}`
                                : "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {truncateText(product.name, 20)}
                          </a>
                        </Typography>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.subcategory}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(product.discount)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(product.priceBefore)}
                      </TableCell>
                      <TableCell align="right">{product.stock}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      ) : (
        <DialogContent>
          <Typography>No products available.</Typography>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ManyProductsDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
};

export default ManyProductsDetailsDialog;
