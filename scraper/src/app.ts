import mongoose from "mongoose";
import bluebird from "bluebird";
import { MONGODB_URI } from "./util/secrets";
import { AdsScraper } from "./adsScraper";
import { NamesScraper as usersScraper } from "./usersScraper";
import request from "request";

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    console.log(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
    process.exit();
  });

console.log("Ready to use mongo.");

const run = async () => {
  // const scraper = new AdsScraper();
  const scraper = new usersScraper();
  const users = await scraper.scrape();
  for (const user of users) {
    const url = "http://localhost:5001/users/";
    try {
      await request.post(
        url,
        { json: user },
        (error: any, response: any, body: any) => {
          if (!error && response.statusCode == 200) {
            console.log(body);
          }
        }
      );
    } catch (e) {
      console.error(e);
    }
  }
  console.log("Success");
};

run();
