import morgan from "morgan";
import fs from "node:fs";
import path from "path";

const __dirname = path.resolve();
export function attachRoutingWithLogger(app, routerPath, router, logsFileName) {
  const logStreem = fs.createWriteStream(
    path.join(__dirname, "./src/logs", logsFileName),
    { flags: "a" }
  );

  app.use(routerPath, morgan("combined", { stream: logStreem }), router);
  app.use(routerPath, morgan("dev"), router);
}
