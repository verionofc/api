import { Elysia } from "elysia";

import { auth } from "../../config/auth.js";

export const betterAuthPlugin = new Elysia({
  name: "Better Auth",
})
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ request, status }) {
        const session = await auth.api.getSession({
          headers: request.headers,
        });

        if (!session) {
          return status(401, {
            message: "Not authenticated",
          });
        }

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });

let _schema:
  | Awaited<ReturnType<typeof auth.api.generateOpenAPISchema>>
  | undefined;

const getSchema = async () =>
  (_schema ??= await auth.api.generateOpenAPISchema());

export const OpenAPI = {
  getPaths: async (prefix = "/auth") => {
    const { paths = {} } = await getSchema();

    const reference: typeof paths = Object.create(null);

    for (const path of Object.keys(paths)) {
      const key = prefix + path;
      const pathItem = paths[path];

      if (!pathItem) continue;

      reference[key] = pathItem;

      for (const method of Object.keys(pathItem)) {
        const operation = (pathItem as Record<string, any>)[method];
        operation.tags = ["Auth system"];
      }
    }

    return reference;
  },

  components: getSchema().then(({ components }) => components),
} as const;