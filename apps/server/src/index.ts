import cors from "cors";
import express from "express";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "localhost:3001",
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
