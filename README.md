# 🚀 Project Name

A modular Node.js + Express + TypeScript application with dynamic route loading, clean folder structure, and support for environment-specific configuration.

---

## 🧠 Overview

This project provides a clean and maintainable architecture for Express-based APIs.  
It includes:
- Dynamic automatic route loading using `loadRoutes`
- Type-safe route definitions with a `RouteHandler` structure
- Environment-specific configuration handling
- Centralized error handling and logging via `netwrap`
- Support for middleware, role-based permissions, and Swagger documentation

---

## 📂 Folder Structure

```bash
src/
├── app.ts
├── constants/
│   └── urls.ts
├── controllers/
│   └── ...
├── middlewares/
│   └── ...
├── routers/
│   ├── health.ts
│   └── adminSettings.ts
├── utils/
│   └── loadRoutes.ts
├── types/
│   └── route.ts


⚙️ How It Works
🧩 Route Loader (loadRoutes.ts)
This utility automatically loads all route definition files from your routers/ folder and registers them on the Express app.

Each router file exports an array of RouteHandler objects like so:

 
const serviceLoader: RouteHandler[] = [
  {
    path: "/check",
    method: "get",
    handlers: [controllers.health.checkServiceHealth],
  },
];
export default serviceLoader;



loadRoutes handles:

Automatic environment-aware loading (.ts in dev, .js in prod)

Logging of all registered routes

Detection of duplicate routes

404 and 405 (method not allowed) responses

Pretty HTML root endpoint with Swagger link




🧭 Example Usage (in app.ts)
 import loadRoutes from "./utils/loadRoutes";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

const environ = process.env.NODE_BUILD_ENV || "production";
const basePath = `/${getters.getAppSecrets().BASEPATH}`;
const showLogs =false # or true
loadRoutes("src/routers", app, basePath, environ, undefined, showLogs)
  .then(async () => {
    app.listen(port, () => {
      logger(`✅ Server running on port ${port}`);
    });
  })
  .catch((err) => console.error("Error loading routes:", err));


🧱 Defining URLs (constants/urls.ts)
To keep routes consistent, we define URLs and methods in one place using a routeCreator helper:
 
export const urls = {
  health: {
    check: () => routeCreator("check"),
    encryptData: () => routeCreator("encrypt", "post"),
    decryptData: () => routeCreator("decrypt", "post"),
  },
};
This ensures your routes and constants remain synchronized.

🧩 Example Router: health.ts
 
import { constants } from "../constants";
import controllers from "../controllers";
import { RouteHandler } from "../types/route";
import { joinUrls } from "../utils";

const serviceLoader: RouteHandler[] = [
  {
    path: joinUrls([constants.urls.health.check().path]),
    method: constants.urls.health.check().method,
    handlers: [controllers.health.checkServiceHealth],
  },
  {
    path: joinUrls([constants.urls.health.encryptData().path]),
    method: constants.urls.health.encryptData().method,
    handlers: [controllers.health.internopayEncryption],
  },
];

export default serviceLoader;


🧑‍💻 Running the Project
🏗 Build
 
npm run build
🚀 Start (Development)
 
npm run dev
🏁 Start with PM2 (Production)
 
pm2 start pm2system.config.js
You can set the environment variable:


NODE_ENV=staging # or production


🧰 Environment Variables
Name	Description	Example
NODE_BUILD_ENV	Determines if .ts or .js files should be loaded	production
BASEPATH	Global API prefix	api/v1
APP_NAME	Application name (displayed on root page)	Netwrap API
PORT	Port number	3000

🧾 Credits
Dynamic route loader inspiration: adapted and improved from an open-source implementation by @tylerdgenius/express-routes-loader
(original concept: auto-register Express routes based on file structure).
The current version has been rewritten, extended, and optimized for TypeScript and production readiness — including better logging, duplicate detection, wildcard handling, and environment awareness.

🛡 License
This project is licensed under the MIT License — you are free to use, modify, and distribute it.

 