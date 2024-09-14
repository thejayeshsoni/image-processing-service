import { Router } from "express";
import apiController from "../controller/apiController";
import rateLimit from "../middleware/rateLimit";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = Router();

router.route("/self").get(rateLimit, apiController.self);
router.route("/health").get(apiController.health);
router
  .route("/upload-csv")
  .post(upload.single("file"), apiController.parseCSV, apiController.handleCSV);
router.route("/check-status/:id").get(apiController.checkStatus);

export default router;
