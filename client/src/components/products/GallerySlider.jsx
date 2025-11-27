import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x200";

const GallerySlider = ({ products = [], isOpenCategory = false }) => {
  if (!products || products.length === 0) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 3 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2, slidesToScroll: 2, initialSlide: 2 },
      },
    ],
  };

  return (
    <div className="px-2">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id}>
            <Link
              to={
                isOpenCategory
                  ? `/category/${encodeURIComponent(product.category)}`
                  : `/store/${product.storeId}?productId=${product.id}`
              }
            >
              <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="relative mb-3">
                  <img
                    src={product.image || PLACEHOLDER_IMAGE}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  {product.discount && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                <h3 className="text-md font-semibold mb-1 line-clamp-2">
                  {product.name}
                </h3>

                <p className="text-green-600 font-bold">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(product.price)}
                </p>

                {product.discount && (
                  <span className="text-gray-400 line-through text-sm mr-1">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(product.priceBefore)}
                  </span>
                )}

                <p className="text-xs text-gray-400 mt-2">{product.category}</p>
              </div>
            </Link>
          </div>
        ))}
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
    })
  ),
  isOpenCategory: PropTypes.bool,
};

export default GallerySlider;