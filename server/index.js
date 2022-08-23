const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserRouter = require("./users/userRoutes");
const PostRouter = require("./posts/post.routes");
const { conversationRouter } = require("./routes/conversation.routes");
const { messageRouter } = require("./routes/message.routes");
const CommentRouter = require("./comments/comment.routes");

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
