import { signedURL, signin, verify } from "@/controllers/auth";
import express, { Router } from "express";

const router: Router = express.Router();

router.post("/signin", signin);
router.post("/verify", verify);
router.post("/signedurl", signedURL);

export default router;
