import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(
      "data Base is connected at host ",
      mongoose.connection.readyState
    );
  } catch (error) {
    console.log("mongodb connection faild due to this error ", error.message);
  }
};
