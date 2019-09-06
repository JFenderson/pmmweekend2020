import { Router } from "express";
import multer from "multer";
import path from 'path';
let router = Router();
let images = path.join(__dirname, "../src/assets/images");

let Storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, images);
  },
  filename: function(req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

var upload = multer({
  storage: Storage,
  limits: { fileSize: 1024 * 1024 * 5 }
});

router.post("/dev/post", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false
    });
  } else {
    console.log("file received");
    return res.send({
      success: true
    });
  }
});

export default router;
