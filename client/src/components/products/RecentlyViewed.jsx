// src/components/products/RecentlyViewed.jsx
import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import ProductRating from "../../components/products/ProductRating";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import PLACEHOLDER_IMAGE from "../../utils/api";

const RecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    const storedRecentlyViewed = localStorage.getItem("recentlyViewed") || [];
    if (storedRecentlyViewed.length > 0) {
      setRecentlyViewed(JSON.parse(storedRecentlyViewed));
    }
  }, []);

  // Arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        sliderRef.current?.slickPrev();
      } else if (e.key === "ArrowRight") {
        sliderRef.current?.slickNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!recentlyViewed.length) return null;

  const settings = {
    dots: true,
    infinite: recentlyViewed.length > 3,
    speed: 500,
    slidesToShow: 3, // Large screens: 3
    slidesToScroll: 2,
    autoplay: false,
    arrows: true,
    pauseOnHover: true,
    centerMode: false,
    variableWidth: false,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1100, // Tablets and iPads: 2
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
          infinite: recentlyViewed.length > 2,
        },
      },
      {
        breakpoint: 600, // Mobile: 1
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          infinite: recentlyViewed.length > 1,
        },
      },
    ],
  };

  return (
    <div className="recently-viewed-section w-full px-2 sm:px-4 py-4 sm:py-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 px-2">
        Recently Viewed: {recentlyViewed.length}
      </h2>
      <Slider ref={sliderRef} {...settings}>
        {recentlyViewed.map((product) => (
          <div key={product._id} className="px-2">
            <Link
              to={`/store/${product.storeId}?productId=${product.id}`}
              target="_blank"
            >
              <div className="border rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow duration-200">
                <img
                  src={product.image || PLACEHOLDER_IMAGE}
                  alt={product.name}
                  className="w-full h-40 sm:h-48 md:h-56 object-cover mb-3 sm:mb-4 rounded"
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_IMAGE;
                  }}
                />
                <h3 className="text-sm sm:text-base lg:text-lg font-medium mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-base sm:text-lg lg:text-xl font-bold text-green-600 mb-2">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(product.price)}
                </p>
                <div className="scale-90 origin-left">
                  <ProductRating
                    rating={product.ratings || product.rating || 0}
                  />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RecentlyViewed;
