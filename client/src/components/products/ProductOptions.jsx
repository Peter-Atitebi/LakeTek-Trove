import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { blue, green, orange, red, grey } from "@mui/material/colors";

const productOptions = [
  { id: "view", label: "View Details", icon: VisibilityIcon, color: blue },
  { id: "edit", label: "Edit Product", icon: EditIcon, color: green },
  { id: "duplicate", label: "Duplicate", icon: ContentCopyIcon, color: orange },
  { id: "share", label: "Share", icon: ShareIcon, color: grey },
  { id: "delete", label: "Delete", icon: DeleteIcon, color: red },
];

function ProductOptions(props) {
  const { onClose, selectedValue, open, productName } = props;

  const handleClose = () => {
    onClose(null);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        {productName ? `Options for "${productName}"` : "Product Options"}
      </DialogTitle>
      <List sx={{ pt: 0, minWidth: 300 }}>
        {productOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <ListItem disablePadding key={option.id}>
              <ListItemButton onClick={() => handleListItemClick(option.id)}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: option.color[100],
                      color: option.color[600],
                    }}
                  >
                    <IconComponent />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={option.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Dialog>
  );
}

ProductOptions.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string,
  productName: PropTypes.string,
};

export default function ProductOptionsDemo() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");
  const [productName] = React.useState("Wireless Headphones");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    if (value) {
      setSelectedValue(value);
      // Handle the selected action
      switch (value) {
        case "view":
          console.log("Viewing product details...");
          break;
        case "edit":
          console.log("Editing product...");
          break;
        case "duplicate":
          console.log("Duplicating product...");
          break;
        case "share":
          console.log("Sharing product...");
          break;
        case "delete":
          console.log("Deleting product...");
          break;
        default:
          break;
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h6" component="div" gutterBottom>
        Product: {productName}
      </Typography>
      {selectedValue && (
        <Typography
          variant="body2"
          component="div"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Last action: {selectedValue}
        </Typography>
      )}
      <Button variant="contained" onClick={handleClickOpen}>
        Product Options
      </Button>
      <ProductOptions
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        productName={productName}
      />
    </div>
  );
}
