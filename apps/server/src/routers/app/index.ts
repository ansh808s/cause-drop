import {
  createCampaign,
  getCampaign,
  getUserCampaigns,
  signedURL,
} from "@/controllers/app";
import { authenticateToken } from "@/middlewares";
import express, { Router } from "express";

const router: Router = express.Router();

router.post("/campaign", authenticateToken, createCampaign);
router.get("/campaign/:slug", getCampaign);
router.get("/campaign", authenticateToken, getUserCampaigns);
router.get("/signedurl", authenticateToken, signedURL);

export default router;
