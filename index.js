require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDB } = require("./dbConnection");
const app = express();
const userRouter = require("./src/routes/user.routes");
const transactionRouter = require("./src/routes/transactions.routes");
const settingsRouter = require("./src/routes/settings.routes");
const notificationRouter = require("./src/routes/notification.routes");
const battleRouter = require("./src/routes/battle.routes");
const specs = require("./src/docs/swagger");
require("./src/cron");
const PORT = process.env.PORT || 8000;
const swaggerUi = require("swagger-ui-express");
app.use(cors());
app.use(bodyParser.json());
const path = require("path");

app.use("/api/v1/users", userRouter);
app.use("/api/v1/transaction", transactionRouter);
app.use("/api/v1/admin", settingsRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/battle", battleRouter);

app.get("/", (req, res) => {
  // res.send("server is running");
  res.redirect("/login");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
