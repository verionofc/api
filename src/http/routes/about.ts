import { Elysia } from "elysia";
import { Package } from "../../config/package.js";


export const aboutRoutes = new Elysia({ prefix: "/about" })
  .get(
    "/",
    () => ({
      name: Package.name,
      version: Package.version,
      author: Package.author,
      environment: process.env.NODE_ENV ?? "development",
      production: process.env.NODE_ENV === "production",
    }),
    {
      detail: {
        summary: "About the API",
        tags: ["Default"],
      },
    },
  );
