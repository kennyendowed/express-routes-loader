import { RequestHandler, Express } from "express";

export function attachWildcardHandler(
  app: Express,
  prefix: string,
  custom?: RequestHandler,
) {
  if (custom) return app.use(custom);

  app.use((req, res) => {
    const routes =
      app._router?.stack
        ?.filter((layer: any) => layer.route)
        .map((layer: any) => ({
          path: layer.route.path,
          methods: Object.keys(layer.route.methods),
        })) || [];

    const match = routes.find((r:any) => r.path === req.path);

    if (match) {
      return res.status(405).json({
        message: `Method Not Allowed. Supported: ${match.methods
          .join(", ")
          .toUpperCase()}`,
      });
    }

    if (req.path === "/") {
      const url = `${req.protocol}://${req.get("host")}${prefix}/api-docs`;
      const appName = process.env.APP_NAME || "Service";

      return res.send(`
        <h1>${appName} Running 🚀</h1>
        <p><a href="${url}">Swagger Documentation</a></p>
      `);
    }

    return res.status(404).json({
      message: `Route Not Found → ${req.method} ${req.path}`,
    });
  });
}
