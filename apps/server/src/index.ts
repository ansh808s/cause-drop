import cors from "cors";
import express, { type RequestHandler } from "express";
import { router } from "./routers";
import { actionCorsMiddleware } from "@solana/actions";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

const getActionsJson: RequestHandler = (req, res) => {
  const payload = {
    rules: [
      { pathPattern: "/*", apiPath: "/api/actions/*" },
      { pathPattern: "/api/actions/**", apiPath: "/api/actions/**" },
    ],
  };
  res.json(payload);
  return;
};

// @ts-ignore
app.use(actionCorsMiddleware());

app.get("/actions.json", getActionsJson);

app.use("/api", router);

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
