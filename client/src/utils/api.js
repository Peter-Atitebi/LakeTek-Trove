const BASE_URL = "http://localhost:5001/";

// function to construct full image URL
export const loadImage = (image) => {
  if (!image) {
    return `${BASE_URL}${image}`;
  }
};

const PLACEHOLDER_IMAGE =
  "https://dummyimage.com/250x250/f5f5f5/999999.png&text=No+Image+Available";

export const SERVER_BASE_URL = `${BASE_URL}api/`;
export default PLACEHOLDER_IMAGE;
