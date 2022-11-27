const express = require("express");
const cors = require("cors");

// middleware
const app = express();
app.use(express.json());
app.use(cors());

// Connect MongoDB using mongoose
const mongoose = require("mongoose");
const options = {
  keepAlive: true,
  connectTimeoutMS: 10000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const MONGO_URL =
  "mongodb+srv://mern-api:jOyvLH5AcxLqXmSa@mern.syrqciq.mongodb.net/?retryWrites=true&w=majority";

// Mongo DB connection
mongoose.connect(MONGO_URL, options, (err) => {
  if (err) console.log(err);
});

// Validate DB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Mongo DB Connected successfully");
});

// Schema for posts
let Schema = mongoose.Schema;
let postSchema = new Schema(
  {
    id: {
      type: Number,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

// Post Model
let PostModel = mongoose.model("posts", postSchema);

app.get("/", (req, res) => {
  res.send("Your are lucky!! server is running...");
});

/**GET API: GETs Posts from DB and returns as response */
app.get("/posts", async (req, res) => {
  try {
    let posts = await PostModel.find();
    res.json({
      status: 200,
      data: posts,
    });
  } catch (error) {
    res.json({
      status: 400,
      message: error.message,
    });
  }
});

/** POST API: Gets new book info from React and adds it to DB */
app.post("/posts", async (req, res) => {
  const inputPost = req.body;

  try {
    let post = new PostModel(inputPost);
    post = await post.save();
    res.json({
      status: 200,
      data: post,
    });
  } catch (error) {
    res.json({
      status: 400,
      message: error.message,
    });
  }
});

/** DELETE API: Gets ID of the book to be deleted from React and deletes the book in db.
 * Sends 400 if there is no book with given id
 * Sends 500 if there is an error while saving data to DB
 * Sends 200 if deleted successfully
 */
app.delete("/posts/:postId", async (req, res) => {
  try {
    let post = await PostModel.findByIdAndRemove(req.params.postId);
    if (post) {
      res.json({
        status: 200,
        message: "Book deleted successfully",
      });
    } else {
      res.json({
        status: 400,
        message: "No Book found",
      });
    }
  } catch (err) {
    res.json({
      status: 400,
      message: err.message,
    });
  }
});

app.listen(8080);
