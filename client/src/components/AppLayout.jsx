// src/components/AppLayout.jsx

import MainHeader from "./navBars/MainAppBar";
import PropTypes from "prop-types";

const AppLayout = ({ children, classes = "", showHeader = true }) => {
  return (
    <>
      {/* header */}

      {showHeader && <MainHeader />}
      <main className={`mb-10 ${classes}`}>
        <div className="px-4 sm:px-2 lg:px-4 py-6">{children}</div>
      </main>
    </>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.string,
  showHeader: PropTypes.bool,
};

export default AppLayout;
