const http = require("http");
const app = require("./app/app");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/track-study"; 

const server = http.createServer(app);

// mongoose.set("strictQuery", false);
mongoose.connect(DB_URL, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Dataabse ${data.name} is connected`);
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
});
