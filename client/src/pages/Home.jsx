//src/pages/Home.jsx
import AppLayout from "../components/AppLayout";
import AppFooter from "../components/footer/AppFooter";
import HomeFeed from "../components/products/HomeFeed";
import BestDeals from "../components/products/BestDeals";

const Home = () => {
  return (
    <>
      <AppLayout>
        {/* Best Deals */}
        <BestDeals />

        {/* Home Feed */}
        <HomeFeed />

        {/* Recently Viewed */}
      </AppLayout>

      {/* Footer */}
      <AppFooter />
    </>
  );
};
export default Home;
