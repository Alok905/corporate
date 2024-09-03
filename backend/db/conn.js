import mongoose from "mongoose";

export default async function connectToDB() {
  try {
    const res = await mongoose.connect(process.env.MONGO);
    console.log("Connected to database successfully.");
  } catch (error) {
    console.log("Error connecting to database");
  }
}
