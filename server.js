const http = require("http");

const app = require("./app");
const { sequelize } = require("./app/models");
const { APP_NAME, APP_PORT } = require("./config/app");

app.set("port", APP_PORT);

const server = http.createServer(app);
server.listen(APP_PORT);

server.on("error", (err) => {
  console.error(err);
});

server.on("listening", async () => {
  try {
    await sequelize.authenticate();
    console.log(
      `Connection to '${sequelize.options.database}' database has been established successfully`
    );
    console.log(`${APP_NAME} Started on Port: ${APP_PORT}`);
  } catch (err) {
    console.log(err);
  }
});
