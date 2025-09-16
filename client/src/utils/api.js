const BASE_URL = "http://localhost:5001/";

// function to construct full image URL
export const loadImage = (image) => {
  if (!image) {
    return `${BASE_URL}${image}`;
  }
};

export const SERVER_BASE_URL = `${BASE_URL}api/`;
