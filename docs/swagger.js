
module.exports.swaggerDocument = {
    openapi: "3.0.1",
    info: {
      version: "1.0.0",
      title: "Adamson Research API",
      description: "Adamson Research API Documentation",
      termsOfService: "",
      contact: {
        name: "Lance Pineda",
        email: "ldpineda@techfactors.com",
      },
      license: {
        name: "Apache 2.0",
        url: "https://www.apache.org/licenses/LICENSE-2.0.html",
      },
    },
    components: {
      schemas: {},
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      persistAuthorization: true,
    },
    paths: {
    },
  };
  