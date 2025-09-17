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
import CustomerWelcomeTemplate from "./partials/CustomerWelcomeTemplate";
import CustomerTransactions from "./partials/CustomerTransactions";
import CustomerOrdersTemplate from "./partials/CustomerOrdersTemplate";
import CustomerCartTemplate from "./partials/CustomerCartTemplate";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

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
    segment: "transactions",
    title: "Transactions",
    icon: <AttachMoneyIcon />,
  },
  {
    segment: "cart",
    title: "Cart",
    icon: <ShoppingCartIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
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
        return <CustomerWelcomeTemplate />;
      case "/orders":
        // Orders Management
        return <CustomerOrdersTemplate />;
      case "/transactions":
        // Transactions Overview
        return <CustomerTransactions />;
      case "/cart":
        // Cart Overview
        return <CustomerCartTemplate />;
      default:
        return <CustomerWelcomeTemplate />;
    }
  };

  return renderTemplate();
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function PublicUserDashboard(props) {
  const { window } = props;
  const { session, signIn, signOut } = useAuthentication();

  const demoWindow = window !== undefined ? window() : undefined;
  const [pathname, setPathname] = useState("");

  // Move useCallback to top level - this was the original issue
  const navigate = useCallback((path) => setPathname(String(path)), []);

  useEffect(() => {
    if (session?.user?.id) {
      setPathname(`/user/dashboard/${session.user.id}`);
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
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}

PublicUserDashboard.propTypes = {
  window: PropTypes.func,
};

export default PublicUserDashboard;
