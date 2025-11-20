//src/pages/Home.jsx

import AppLayout from "../components/AppLayout";
import AppFooter from "../components/footer/AppFooter";
import HomeFeed from "../components/products/HomeFeed";

const Home = () => {
  return (
    <>
      <AppLayout>
        <HomeFeed />
      </AppLayout>

      {/* Footer */}
      <AppFooter />
    </>
  );
};
export default Home;
