const monk = require("monk");
const db = monk(process.env.MONGO_URI);

db.then(() => {
  console.log("Connected correctly to server");
}).catch((err) => {
  console.log(err);
});

module.exports = db;
