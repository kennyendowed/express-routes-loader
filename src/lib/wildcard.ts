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

    const match = routes.find((r: any) => r.path === req.path);

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
      const version = process.env.npm_package_version || "1.0.0";
      const env = process.env.NODE_ENV || "development";
      const appDescription = process.env.APP_DESCRIPTION || "API Documentation";

      const html = `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>${appName} 🚀</title>
                <style>
                  body {
                    font-family: system-ui, sans-serif;
                    background: #f5f8fb;
                    color: #333;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                  }
                  .container {
                    background: #fff;
                    padding: 2rem 3rem;
                    border-radius: 14px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    text-align: center;
                    max-width: 480px;
                  }
                  h1 {
                    color: #0078d7;
                    margin-bottom: 0.4rem;
                  }
                  .meta {
                    color: #777;
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                  }
                  a {
                    display: inline-block;
                    background: #0078d7;
                    color: #fff;
                    padding: 10px 22px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 500;
                    transition: background 0.25s;
                  }
                  a:hover { background: #005fa3; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>${appName} API</h1>
                  <p class="meta">Version ${version} • Environment: ${env}</p>
                    <p style="margin-bottom: 1.5rem;">${appDescription}</p>
                  <p>Server is running successfully 🚀</p>
                  <a href="${url}" target="_blank">View Swagger UI</a>
                </div>
              </body>
            </html>
          `;
      res.status(200).send(html);
      return;
    }

    return res.status(404).json({
      message: `Route Not Found → ${req.method} ${req.path}`,
    });
  });
}
