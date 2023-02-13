import multer from "multer";
import path from "path";
// Multer config
const multerUploads = multer({
  storage: multer.diskStorage({}),
  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      //@ts-ignore
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});

export {multerUploads};