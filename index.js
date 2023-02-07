const db = require("./models");
const app = require("./server");

const PORT = 3001;

async function startApp() {
  try {
    await db.sequelize.sync();
    await db.sequelize.authenticate();
    console.log("Connection has been established successfully.");

    app.listen(PORT, () => console.log("Server listening on PORT: " + PORT));
  } catch (err) {
    console.log(err);
  }
}

startApp();
