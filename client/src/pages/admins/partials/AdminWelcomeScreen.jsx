// src/pages/admins/partials/AdminWelcomeScreen.jsx
import { Button, Typography } from "@mui/material";
import EditAccountDialog from "../../../components/EditAccountDialog";
import { useState, useEffect } from "react";
const AdminWelcomeScreen = () => {
  const [isOpenEditInformation, setIsOpenEditInformation] = useState(false);
  const handleOpenEditInformation = () => {
    setIsOpenEditInformation(true);
  };

  const handleCloseEditInformation = () => {
    setIsOpenEditInformation(false);
  };

  const handleOnSave = (user) => {
    setIsOpenEditInformation(false);
  };

  return (
    <div className="p-4">
      <div className="p-4 border-1 border-default border-dashed rounded-base">
        <Typography variant="h5" className="mb-4 font-semibold">
          Welcome to the Admin Dashboard
        </Typography>

        <div className="px-4 py-3 rounded-base bg-neutral-secondary-soft mb-4">
          <div className="block space-y-1">
            <h2 className="text-fg-disabled">
              {/* Account Overview */}
              Account Details
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your personal information, email address, and password
            </p>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenEditInformation}
            >
              Edit Account Info
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center justify-center h-24 rounded-base bg-neutral-secondary-soft">
            <p className="text-fg-disabled">
              {/* Sales Overview */}
              Sales Overview
            </p>
          </div>
          <div className="flex items-center justify-center h-24 rounded-base bg-neutral-secondary-soft">
            <p className="text-fg-disabled">
              {/* Orders Overview */}
              Orders Overview
            </p>
          </div>
          <div className="flex items-center justify-center h-24 rounded-base bg-neutral-secondary-soft">
            <p className="text-fg-disabled">
              {/* Total Sellers */}
              Total Sellers: 32k
            </p>
          </div>
          <div className="flex items-center justify-center h-24 rounded-base bg-neutral-secondary-soft">
            <p className="text-fg-disabled">
              {/* Total active products */}
              Total Active Products: 120k
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-48 rounded-base bg-neutral-secondary-soft mb-4">
          <p className="text-fg-disabled">Store Credit</p>
        </div>
      </div>
      <EditAccountDialog
        open={isOpenEditInformation}
        onClose={handleCloseEditInformation}
        onSave={handleOnSave}
      />
    </div>
  );
};

export default AdminWelcomeScreen;
