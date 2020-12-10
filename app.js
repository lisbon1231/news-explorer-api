require("dotenv").config();
const express = require("express");

const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { requestLogger, errorLogger } = require("./middleware/logger");
const allRoutes = require("./routes/index");
const { DATABASE, ERRORS } = require("./utils/constants.js");
const { limiter } = require("./middleware/expressLimiter");
const { handlingErrors } = require("./middleware/errors/celebrateErrors");
// listen to port 3000
const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json(), cors());
app.use(requestLogger);
app.use(helmet());
app.use(limiter);

const connectionURL = DATABASE;

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(() => app.listen(PORT, () => console.log(`Server is running on port: http://localhost:${PORT}`))).catch((err) => console.log(`${err} could not connect`));
app.use("/", allRoutes);

app.use(errorLogger);

app.use((req, res) => {
  res.status(ERRORS.notFound).json({ message: ERRORS.notFound });
});
app.use(handlingErrors);
// app.use((err, req, res) => {
//   console.log("next");

//   if (err.name === "MongoError" && err.code === 11000) {
//     res.status(409).send({ message: "Email already exists" });
//   } else if (err.statusCode === undefined) {
//     const { statusCode = 400, message } = err;
//     res.status(statusCode).send({
//       message: statusCode === 400 ? "Invalid data passed" : message,
//     });
//   } else {
//     const { statusCode, message } = err;
//     res.status(statusCode).send({ message });
//   }
// });
