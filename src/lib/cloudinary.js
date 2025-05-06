import { v2 as cloudinary } from "cloudinary";

import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: os.getenv("CLOUDINARY_CLOUD_NAME"),
  api_key: os.getenv("CLOUDINARY_API_KEY"),
  api_secret: os.getenv("CLOUDINARY_API_SECRET"),
});

export default cloudinary;
