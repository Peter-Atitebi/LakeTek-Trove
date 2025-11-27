import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ProductRating from "../../components/products/ProductRating";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x200";

const GallerySlider = ({ products = [], isOpenCategory = false }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No products available</p>
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: products.length > 1,
    speed: 500,
    slidesToShow: 1, // Always show 1 product
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    pauseOnHover: true,
    centerMode: false,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="gallery-slider-wrapper w-full">
      <style>{`
        .gallery-slider-wrapper .slick-slide {
          padding: 0 8px;
        }
        .gallery-slider-wrapper .slick-list {
          margin: 0 -8px;
        }
        .gallery-slider-wrapper .slick-dots {
          display: none !important;
        }
        .gallery-slider-wrapper .slick-prev,
        .gallery-slider-wrapper .slick-next {
          z-index: 10;
          width: 40px;
          height: 40px;
        }
        .gallery-slider-wrapper .slick-prev {
          left: -20px;
        }
        .gallery-slider-wrapper .slick-next {
          right: -20px;
        }
        .gallery-slider-wrapper .slick-prev:before,
        .gallery-slider-wrapper .slick-next:before {
          color: #9333ea;
          font-size: 30px;
        }
        @media (max-width: 768px) {
          .gallery-slider-wrapper .slick-prev,
          .gallery-slider-wrapper .slick-next {
            display: none !important;
          }
        }
      `}</style>

      <Slider {...settings}>
        {products.map((product, index) => {
          const hasDiscount =
            product.priceBefore && product.priceBefore > product.price;
          const discountPercentage = hasDiscount
            ? Math.round(
                ((product.priceBefore - product.price) / product.priceBefore) *
                  100
              )
            : 0;

          return (
            <div
              key={product.id || product._id || `product-${index}`}
              className="px-2"
            >
              <Link
                to={
                  isOpenCategory
                    ? `/category/${encodeURIComponent(product.category)}`
                    : `/store/${product.storeId}?productId=${product.id}`
                }
                target="_blank"
                className="block group"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full max-w-2xl mx-auto">
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gray-100">
                    <img
                      src={product.image || PLACEHOLDER_IMAGE}
                      alt={product.name}
                      className="w-full h-64 sm:h-80 lg:h-96 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />

                    {/* Discount Badge */}
                    {hasDiscount && discountPercentage > 0 && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                        -{discountPercentage}%
                      </span>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 lg:p-8 text-center">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 line-clamp-2 text-gray-800 group-hover:text-purple-600 transition-colors duration-200 min-h-[3rem]">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="mb-4 flex justify-center">
                      <ProductRating rating={product.rating || 0} />
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-1 items-center">
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(product.price)}
                      </p>

                      {hasDiscount && (
                        <span className="text-gray-400 line-through text-sm sm:text-base">
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(product.priceBefore)}
                        </span>
                      )}
                    </div>

                    {/* Category */}
                    {product.category && (
                      <p className="text-sm text-gray-400 mt-4">
                        {product.category}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

GallerySlider.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      name: PropTypes.string,
      price: PropTypes.number,
      priceBefore: PropTypes.number,
      discount: PropTypes.number,
      category: PropTypes.string,
      storeId: PropTypes.string,
      id: PropTypes.string,
      _id: PropTypes.string,
      rating: PropTypes.number,
    })
  ),
  isOpenCategory: PropTypes.bool,
};

export default GallerySlider;
