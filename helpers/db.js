const mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect(
    "mongodb+srv://dbUser:dbUserPass@clusternodejs.i0tbc.mongodb.net/movieappdb",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  mongoose.connection.on("open", () => {
    console.log("MongoDB: Connected.");
  });
  mongoose.connection.on("error", () => {
    console.log("MongoDB: Connection Failed.");
  });
//   mongoose.Promise = global.Promise;
};
