import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

function ProductsTable({ products, onEdit, onDelete }) {
  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          alt={params.row.name}
          sx={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "price",
      headerName: "Price",
      width: 130,
      renderCell: (params) => (
        <span>₦{Number(params.value).toLocaleString()}</span>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            aria-label="edit"
            onClick={() => onEdit?.(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            aria-label="delete"
            onClick={() => onDelete?.(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Store price as NUMBER, not formatted string
  const rows =
    products &&
    products.length > 0 &&
    products.map((product) => ({
      id: product.id,
      name: product.name,
      price: `${product.price}`,
      category: product.category,
      image: product.image,
    }));

  return rows && rows.length > 0 ? (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableRowSelectionOnClick
      />
    </Box>
  ) : (
    <div className="flex justify-center items-center py-10">
      <p className="text-2xl text-gray-500">No products available.</p>
    </div>
  );
}

ProductsTable.propTypes = {
  products: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ProductsTable;
