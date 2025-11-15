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

const productActions = [
  { id: "view", label: "View Details", icon: VisibilityIcon, color: blue },
  { id: "duplicate", label: "Duplicate", icon: ContentCopyIcon, color: orange },

  { id: "edit", label: "Edit Product", icon: EditIcon, color: green },
  { id: "share", label: "Share", icon: ShareIcon, color: grey },
  { id: "delete", label: "Delete", icon: DeleteIcon, color: red },
];

function ProductOptions(props) {
  const { onClose, selectedValue, open, productName } = props;

  const handleClose = () => {
    onClose(null);
  };

  const handleActionClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        {productName ? `Options for "${productName}"` : "Product Actions"}
      </DialogTitle>
      <List sx={{ pt: 0, minWidth: 300 }}>
        {productActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <ListItem disablePadding key={action.id}>
              <ListItemButton onClick={() => handleActionClick(action.id)}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: action.color[100],
                      color: action.color[600],
                    }}
                  >
                    <IconComponent />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={action.label} />
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
  product: PropTypes.object.isRequired,
  productName: PropTypes.string,
};

export default ProductOptions;
