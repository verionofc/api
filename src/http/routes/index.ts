import { Elysia } from "elysia";

export const indexRoutes = new Elysia()
  .get(
    "/",
    () => ({
      message: "Hello, Verion.",
    }),
    {
      detail: {
        summary: "Health check",
        tags: ["Default"],
      },
    },
  );
