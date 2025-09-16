//src/pages/Home.jsx

import AppLayout from "../components/AppLayout";
import AppFooter from "../components/footer/AppFooter";

const Home = () => {
  return (
    <>
      <AppLayout>
        <h1>HomePage</h1>
        <p>This is my home page.</p>
      </AppLayout>

      {/* Footer */}
      <AppFooter />
    </>
  );
};
export default Home;
