const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserRouter = require("./Routes/userRoutes");
const PostRouter = require("./Routes/postRoutes");
const CommentRouter = require("./Routes/commentRoutes");
const CMSFunc = require("./Utils/most-popular-first-names");
const { conversationRouter } = require("./Routes/conversationRoutes");
const { messageRouter } = require("./Routes/messageRoutes");
// const User = require("./Controllers/userController");

dotenv.config();
const port = process.env.port || 5001;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
app.use("/users", UserRouter);
app.use("/posts", PostRouter);
app.use("/comments", CommentRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);

app.get("/", (req, res) => {
  res.send("Im alive");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() =>
    app.listen(port, () => {
      console.log(`server is running on port: ${port}`);
    })
  )
  .catch((err) => console.log("dont succeed to connect"));
