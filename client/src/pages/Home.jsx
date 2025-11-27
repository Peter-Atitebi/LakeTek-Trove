//src/pages/Home.jsx
import AppLayout from "../components/AppLayout";
import AppFooter from "../components/footer/AppFooter";
import HomeFeed from "../components/products/HomeFeed";
import BestDeals from "../components/products/BestDeals";
import RecentlyViewed from "../components/products/RecentlyViewed";

const Home = () => {
  return (
    <>
      <AppLayout>
        {/* Best Deals */}
        <BestDeals />

        {/* Home Feed */}
        <HomeFeed />

        {/* Recently Viewed */}
        <RecentlyViewed />
      </AppLayout>

      {/* Footer */}
      <AppFooter />
    </>
  );
};
export default Home;
