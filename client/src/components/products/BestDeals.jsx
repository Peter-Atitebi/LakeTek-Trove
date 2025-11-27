// src/components/products/BestDeals.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import GallerySlider from "./GallerySlider";
import useAuthentication from "../../hooks/useAuthentication";
import { SERVER_BASE_URL } from "../../utils/api";
import LoadingSpinnerBody from "../LoadingSpinnerBody";
import ctgories from "../../hooks/CList";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const BestDeals = () => {
  const { session } = useAuthentication();
  const [bestDeals, setBestDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getBestDeals();
  }, []);

  const getBestDeals = async () => {
    if (!session?.token) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.get(`${SERVER_BASE_URL}products/best-deals`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      setBestDeals(res.data?.data || res.data || []);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinnerBody />;

  if (errorMessage) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Error: {errorMessage}</p>
        <button
          onClick={getBestDeals}
          className="mt-3 px-4 py-2 bg-black text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 py-4 lg:py-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          {/* Header Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Best Deals
              </span>
              <br />
              <span className="text-gray-800 text-2xl sm:text-3xl">
                20% off
              </span>
            </h2>

            {/* Horizontal Scrolling Categories */}
            <div className="overflow-x-auto pb-2 -mx-2 px-2">
              <div className="flex gap-2 min-w-max">
                {ctgories.slice(0, 10).map((category, index) => (
                  <Link
                    key={index}
                    to={`/category/${encodeURIComponent(category.name)}`}
                    className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full text-sm font-medium text-gray-700 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 whitespace-nowrap"
                    target="_blank"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            {bestDeals.length > 0 ? (
              <GallerySlider products={bestDeals} isOpenCategory={true} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-base">
                  No deals available at the moment.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout (lg and above) */}
        <div className="hidden lg:flex gap-6 items-stretch bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-sm p-6">
          {/* Left Sidebar */}
          <div className="w-64 xl:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Best
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Deals
                  </span>
                  <br />
                  <span className="text-gray-800">20% off</span>
                </h2>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-purple-200 via-pink-200 to-transparent mb-6"></div>

              {/* Category List */}
              <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
                {ctgories.slice(0, 15).map((category, index) => (
                  <Link
                    key={index}
                    to={`/category/${encodeURIComponent(category.name)}`}
                    className="group flex items-center py-2.5 px-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
                    target="_blank"
                  >
                    <ArrowForwardIcon
                      className="text-gray-400 group-hover:text-purple-600 mr-3 transition-colors duration-200"
                      style={{ fontSize: "18px" }}
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors duration-200">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area - FIXED FOR WIDE SCREENS */}
          <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-lg p-6 xl:p-8">
            {bestDeals.length > 0 ? (
              <div className="w-full">
                <GallerySlider products={bestDeals} isOpenCategory={true} />
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">
                    No deals available at the moment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestDeals;
