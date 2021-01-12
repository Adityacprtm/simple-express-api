const process = require("process");
const monk = require("monk");
const db = monk(
  process.env.MONGO_URI ||
    "mongodb+srv://aditya:Batubata@cluster0.ir6ey.mongodb.net/users?retryWrites=true&w=majority"
);

db.then(() => {
  console.log("Connected correctly to server");
}).catch((err) => {
  console.log(err);
});

module.exports = db;
