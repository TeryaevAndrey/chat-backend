import cloudinary from "cloudinary";

const cloudinaryConfig = () => {
  //@ts-ignore
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export {cloudinaryConfig};
