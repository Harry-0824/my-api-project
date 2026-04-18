const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");

const app = express();

// 安全 HTTP headers
app.use(helmet());

// gzip 壓縮
app.use(compression());

// CORS 白名單
const allowedOrigins = [
  "http://localhost:3000",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin && process.env.NODE_ENV !== "production")
        return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("CORS policy: origin not allowed"));
    },
    credentials: true,
  }),
);

// API 限流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "請求過於頻繁，請稍後再試" },
});
app.use("/api/", limiter);

// 解析 JSON
app.use(express.json());

// 路由
const modelsRouter = require("./routes/models");
const trimsRouter = require("./routes/trims");
const authRouter = require("./routes/auth");
const slidesRouter = require("./routes/slides");
const articlesRouter = require("./routes/articles");

app.use("/api/models", modelsRouter);
app.use("/api/trims", trimsRouter);
app.use("/api/auth", authRouter);
app.use("/api/slides", slidesRouter);
app.use("/api/articles", articlesRouter);

app.get("/api/hello", (req, res) => {
  const name = req.query.name || "World";
  res.status(200).json({ message: "GET 請求成功！", data: `Hello, ${name}!` });
});

module.exports = app;
