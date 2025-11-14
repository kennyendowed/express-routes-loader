import { Express } from "express";
import { LoadRouteOptions } from "../types";
import { scanRouteModules } from "./routeScanner";
import { registerRoutes } from "./routeRegistrar";
import { attachWildcardHandler } from "./wildcard";
import  logger  from "./logger";

export default async function loadRoutes(
  folder: string,
  app: Express,
  options: LoadRouteOptions = {},
) {
  const {
    prefix = "",
    env = process.env.NODE_ENV || "development",
    wildcardHandler,
    hideLogs = false,
  } = options;

  const start = Date.now();
  const registry = new Set<string>();

  if (!hideLogs) {
    logger.info(`Environment → ${env}`);
    logger.info(`Scanning routes → ${folder}`);
  }

  const modules = scanRouteModules(folder, env, hideLogs);

  modules.forEach((mod) => {
    registerRoutes(app, mod.prefix, mod.routes, prefix, hideLogs, registry);
  });

  attachWildcardHandler(app, prefix, wildcardHandler);

  if (!hideLogs)
    logger.info(`Routes loaded in ${(Date.now() - start).toFixed(2)}ms`);
}
