const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mini Project API",
      version: "1.0.0",
      description: "Tài liệu API cho Mini Project",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Quét các file route để tìm @swagger comment
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
