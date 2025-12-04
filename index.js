import express from "express";
import bootstrap from "./src/app.controller.js";
import dotenv from "dotenv";
const app = express();
dotenv.config({ path: "./src/config/.env" });
const port = process.env.PORT || 5200;

await bootstrap(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

export default app;
