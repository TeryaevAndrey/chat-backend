import cloudinary from "cloudinary";

// @ts-ignore

export const cloudinaryConfig = (req, res, next) => {
  // @ts-ignore
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  next();
};
