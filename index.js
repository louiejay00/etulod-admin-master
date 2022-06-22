const port = process.env.PORT || 5000;
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./router/user.js");
const driverRoutes = require("./router/driver.js");
const fareRoutes = require("./router/fare.js");
const logsRoute = require("./router/logs.js");
const queueRoute = require("./router/queue");
const adminRoute = require("./router/admin");
const processRoute = require("./router/process");
const path = require("path");
app.use(express.json());
app.use(cors());
//DB URL||URI
const CONNECTION_URL =
  "mongodb+srv://root:root@cluster0.pkf1s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

//Connection Part
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

// User Routes
app.use("/api/v1/user", userRoutes);
//Driver Routes
app.use("/api/v1/driver", driverRoutes);
//fare Routes
app.use("/api/v1/fare", fareRoutes);
//Logs Routess
app.use("/api/v1/log", logsRoute);
app.use("/api/v1/process", processRoute);
app.use("/api/v1/queue", queueRoute);
app.use("/api/v1/admin", adminRoute);

app.use(express.static(path.join(__dirname, "frontend/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

app.listen(port, () => console.log("Running on port 5000"));
