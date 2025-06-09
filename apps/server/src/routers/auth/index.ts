import { signin, verify } from "@/controllers/auth";
import express, { Router } from "express";

const router: Router = express.Router();

router.post("/signin", signin);
router.post("/verify", verify);

export default router;
