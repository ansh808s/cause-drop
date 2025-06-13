import cors from "cors";
import express from "express";
import { router } from "./routers";
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use("/api", router);

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
