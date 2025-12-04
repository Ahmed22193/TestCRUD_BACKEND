import connectDB from "./DB/connection.js";
import AuthRouter from "./Modules/Auth/Auth.controller.js";
import UserRouter from "./Modules/Users/users.controller.js";
import MessageRouter from "./Modules/Messages/messages.controller.js";
import { gloabelError } from "./Utils/GloabelErrorHandleing.utils.js";
import cors from "cors";
import path from "path";
import { corsOptions } from "./Utils/cors/cors.js";
// import { attachRoutingWithLogger } from "./Utils/logger/logger.js";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
const bootstrap = async (app, express) => {
  app.use(helmet());
  // app.use(cors(corsOptions()));
  app.use(express.json());
  app.use(cors());
  

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    message: {
      statusCode: 429,
      message: "Too many requests from this IP, please try again later.",
    },
    legacyHeaders: false,
    standardHeaders: "draft-8",
  });

  app.use(limiter);

  await connectDB();

  // attachRoutingWithLogger(app, "/api/Auth", AuthRouter, "Auth.log");
  // attachRoutingWithLogger(app, "/api/users", UserRouter, "Users.log");
  // attachRoutingWithLogger(app, "/api/messages", MessageRouter, "Messages.log");

  app.get("/", (req, res) => {
    res.status(200).json({ message: "welcome to test templete" });
  });
  app.use("/uploads", express.static(path.resolve("./src/uploads")));

  app.use("/api/Auth", AuthRouter);
  app.use("/api/users", UserRouter);
  app.use("/api/Test", MessageRouter);

  app.all("/*dummy", (req, res, next) => {
    return next(new Error("dummy Routing", { cause: 404 }));
  });

  // global error handler
  app.use(gloabelError);
};

export default bootstrap;
