export function corsOptions() {
  const whiteList = process.env.WHITE_LIST.split(",");
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (whiteList.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };
  return corsOptions;
}
