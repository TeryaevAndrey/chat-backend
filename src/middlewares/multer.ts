import multer from "multer";
import Datauri from "datauri";
import path from "path";

const storage = multer.memoryStorage();

const multerUploads = multer({storage});

// @ts-ignore

const dUri = new Datauri();

// @ts-ignore

const dataUri = (req) => {
  dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
}

export {multerUploads, dataUri};