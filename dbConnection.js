const mongoose = require("mongoose");
exports.connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      "MongoDB connected !! DB HOST: ",
      connectionInstance.connection.name
    );
  } catch (err) {
    console.log("MONGODB connection FAILED ", err);
    process.exit(1);
  }
};
