import { Express } from "express";
import loadRoutes from "./lib/loadRoutes";
import { LoadRouteOptions } from "./types";

export async function initRouteLoader(
  app: Express,
  folderPath: string,
  options: LoadRouteOptions = {},
) {
  console.log(`Initializing route loader for folder: ${folderPath}`);
    console.log(`With options: ${JSON.stringify(options)}`);
      
  return loadRoutes(folderPath, app, options);
}

export default initRouteLoader;
