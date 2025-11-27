// src/pages/admins/partials/AdminWelcomeScreen.jsx
import { Typography } from "@mui/material";
const AdminWelcomeScreen = () => {
  return (
    <div className="p-4">
      <div className="p-4 border-1 border-default border-dashed rounded-base">
        <Typography variant="h5" className="mb-4 font-semibold">
          Welcome to the Admin Dashboard
        </Typography>

        <div className="flex items-center justify-center h-48 rounded-base bg-neutral-secondary-soft mb-4">
          <p className="text-fg-disabled">
            {/* Account Overview */}
            Account Details
          </p>
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
    </div>
  );
};

export default AdminWelcomeScreen;
