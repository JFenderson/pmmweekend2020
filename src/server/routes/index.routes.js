import { Router } from "express";
import emailRoutes from "./email";
import membersRoutes from "./members";
import paymentRoutes from "./payment";
// import calendarRoutes from "./calendar";
// import photosRoutes from "./photos";

let router = Router();

router.use("/contact",emailRoutes  );
router.use("/members", membersRoutes);
router.use("/charge", paymentRoutes);
// router.use("/calendar", calendarRoutes);
// router.use("/photos", photosRoutes);

export default router;