import { Router } from "express";
import rootRoutes from "./root";
// import emailRoutes from "./email";
import membersRoutes from "./members";
import paymentRoutes from "./pay";
import calendarRoutes from "./calendar";
// import photosRoutes from "./photos";

let router = Router();

router.use("/", rootRoutes);
// router.use("/email",emailRoutes  );
router.use("/members", membersRoutes);
router.use("/payment", paymentRoutes);
router.use("/calendar", calendarRoutes);
// router.use("/photos", photosRoutes);

export default router;