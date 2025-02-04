const swaggerJsdoc = require("swagger-jsdoc");
const apis = require("../routes/user.routes");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ludo Game API",
      version: "1.0.0",
      description: "API's for Ludo Game",
    },
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
