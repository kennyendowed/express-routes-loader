import { Express, RequestHandler } from "express";
import { RouteHandler } from "../types";
import  logger  from "./logger";

export function registerRoutes(
  app: Express,
  prefix: string,
  routes: RouteHandler[],
  rootPrefix: string,
  hideLogs: boolean,
  registry: Set<string>,
) {
  routes.forEach((route) => {
    const { path, method, handlers } = route;

    const validHandlers = (handlers || []).filter(
      (h): h is RequestHandler => typeof h === "function",
    );

    if (validHandlers.length === 0) {
      logger.error(`Invalid handlers for ${method.toUpperCase()} ${path}`);
      return;
    }

    const fullPath = `${rootPrefix}/${prefix}${path}`.replace(/\/+/g, "/");
    const routeKey = `${method.toUpperCase()} ${fullPath}`;

    if (registry.has(routeKey)) {
      if (!hideLogs) logger.warn(`Duplicate route skipped → ${routeKey}`);
      return;
    }

    (app as any)[method.toLowerCase()](fullPath, ...validHandlers);
    registry.add(routeKey);

    if (!hideLogs) logger.info(`✔ ${method.toUpperCase()} ${fullPath}`);
  });
}
