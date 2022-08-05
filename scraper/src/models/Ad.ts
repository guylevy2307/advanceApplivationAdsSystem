import mongoose from "mongoose";
const Schema = mongoose.Schema;

const adsSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    screens: {
      type: String,
    },
    duration: {
      type: String,
    },
  },
  {
    collection: "holidayAds",
  }
);

module.exports = mongoose.model("Ad", adsSchema);
