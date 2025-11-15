import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { DemoProvider } from "@toolpad/core/internal";
import useAuthentication from "../../hooks/useAuthentication";
import { useCallback, useEffect, useMemo, useState } from "react";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddIcon from "@mui/icons-material/Add";
import SellerWelcomeTemplate from "./partials/SellerWelcomeTemplate";
import SellerTransactions from "./partials/SellerTransactions";
import SellerCreateNewProduct from "./partials/SellerCreateNewProduct";
import SellerOrdersTemplate from "./partials/SellerOrdersTemmplate";
import SellerProductsTemplate from "./partials/SellerProductsTemplate";
import AddProduct from "../../components/products/AddProduct";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "orders",
    title: "Orders",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "products",
    title: "Products",
    icon: <ShoppingBagIcon />,
  },
  {
    segment: "transactions",
    title: "Transactions",
    icon: <AttachMoneyIcon />,
  },
  {
    kind: "divider",
  },
  {
    segment: "create-product",
    title: "Create Product",
    icon: <AddIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <DescriptionIcon />,
      },
      {
        segment: "traffic",
        title: "Traffic",
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: "integrations",
    title: "Integrations",
    icon: <LayersIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  const renderTemplate = () => {
    switch (pathname) {
      case "/dashboard":
        // Welcome Screen
        return <SellerWelcomeTemplate />;
      case "/orders":
        // Orders Management
        return <SellerOrdersTemplate />;
      case "/products":
        // Products Management
        return <SellerProductsTemplate />;
      case "/transactions":
        // Transactions Overview
        return <SellerTransactions />;
      case "/create-product":
        // Create New Product
        return <SellerCreateNewProduct />;
      default:
        return <SellerWelcomeTemplate />;
    }
  };

  return renderTemplate();
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function SellerDashboard(props) {
  const { window } = props;
  const { session, signIn, signOut } = useAuthentication();

  const demoWindow = window !== undefined ? window() : undefined;
  const [pathname, setPathname] = useState("");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Move useCallback to top level - this was the original issue
  const navigate = useCallback((path) => setPathname(String(path)), []);

  useEffect(() => {
    if (session?.user?.id) {
      setPathname(`/seller/dashboard/${session.user.id}`);
    }
  }, [session]);

  // Remove useCallback from inside useMemo - this was the original issue
  const router = useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate,
    }),
    [pathname, navigate]
  );

  const handleOpenAddProduct = () => {
    setIsAddProductOpen(true);
  };

  const handleOnClose = () => {
    setIsAddProductOpen(false);
  };

  const handleOnSave = () => {
    setIsAddProductOpen(false);
  };

  return (
    <DemoProvider window={demoWindow}>
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        session={session}
        authentication={{ signIn, signOut }}
        branding={{
          logo: <img src="/ltt.jpg" alt="Logo" />,
          title: "LakeTek Trove",
        }}
        window={demoWindow}
      >
        <DashboardLayout>
          <div className="flex justify-end items-center px-4 py-2">
            <div>
              <button
                onClick={handleOpenAddProduct}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Product
              </button>
            </div>
          </div>
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
        {/* Add product */}
        <AddProduct
          onClose={handleOnClose}
          onSave={handleOnSave}
          open={isAddProductOpen}
        />
      </AppProvider>
    </DemoProvider>
  );
}

SellerDashboard.propTypes = {
  window: PropTypes.func,
};

export default SellerDashboard;
