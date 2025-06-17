import { donationOption, getCampaignAction } from "@/controllers/actions";
import express, { Router } from "express";

const router: Router = express.Router();

router.get("/donation/:slug", getCampaignAction);
router.options("/donation", donationOption);

export default router;
