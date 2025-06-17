import {
  donation,
  donationOption,
  getCampaignAction,
} from "@/controllers/actions";
import express, { Router } from "express";

const router: Router = express.Router();

router.get("/donation/:slug", getCampaignAction);
router.options("/donation", donationOption);
router.post("/donation", donation);

export default router;
