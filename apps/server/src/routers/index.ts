import express, { Router } from "express";
import authRouter from "./auth";
import appRouter from "./app";
export const router: Router = express.Router();

router.use("/auth", authRouter);
router.use("/app", appRouter);
