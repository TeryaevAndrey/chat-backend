// @ts-ignore

import cloudinary, {uploader} from "cloudinary";

// @ts-ignore

const cloudinaryConfig = (req, res, next) => {
  // @ts-ignore
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  next();
};

export {cloudinaryConfig, uploader};