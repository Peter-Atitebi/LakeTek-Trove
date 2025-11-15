import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

function ProductsTable({ products, onEdit, onDelete }) {
  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="product"
          className="w-12 h-12 object-cover rounded-md border"
        />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      flex: 1,
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
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={() => onDelete(params.row.id)}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return products && products.length > 0 ? (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row.id} // Ensures unique row IDs
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
