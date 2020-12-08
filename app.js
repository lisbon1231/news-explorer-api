require("dotenv").config();
const express = require("express");

const cors = require("cors");
const mongoose = require("mongoose");
const { requestLogger, errorLogger } = require("./middleware/logger");
const { createUser, login } = require("./controllers/user");
const userRouter = require("./routes/user");
const articleRouter = require("./routes/articles");
const auth = require("./middleware/auth");
// listen to port 3000
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json(), cors());
app.use(requestLogger);

const connectionURL = "mongodb://localhost:27017/news";

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(() => app.listen(PORT, () => console.log(`Server is running on port: http://localhost:${PORT}`))).catch((err) => console.log(`${err} could not connect`));
app.post("/singin", login);
app.post("/signup", createUser);
app.use(auth);
app.use("/", userRouter);
app.use("/", articleRouter);

app.use(errorLogger);

app.use((err, req, res) => {
  console.log("next");

  if (err.name === "MongoError" && err.code === 11000) {
    res.status(409).send({ message: "Email already exists" });
  } else if (err.statusCode === undefined) {
    const { statusCode = 400, message } = err;
    res.status(statusCode).send({
      message: statusCode === 400 ? "Invalid data passed" : message,
    });
  } else {
    const { statusCode, message } = err;
    res.status(statusCode).send({ message });
  }
});
