import { Express, Request, Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import { version } from "../../package.json";
import swaggerUi from "swagger-ui-express";
import HTTP from "../utils/constants/http.responses";
import config from "../config";

const specifications = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ToolBox",
      description: "Lorem ipsum dolor sit amet",
      version,
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/api`,
        description: "Development server",
      },
      {
        url: config.PRODUCTION_SERVER,
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        RefreshTokenAuth: {
          type: "apiKey",
          in: "header",
          name: "x-refresh",
        },
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
      },

      security: [
        {
          RefreshTokenAuth: [],
        },
      ],
    },
  },
  apis: ["./src/routes/*.routes.ts", "./src/schemas/*.schemas.ts"],
});

export default function swaggerDocs(server: Express) {
  server.use("/docs", swaggerUi.serve, swaggerUi.setup(specifications));

  server.get("/docs.json", (req: Request, res: Response) => {
    return res.status(HTTP.OK).json(specifications);
  });
}
