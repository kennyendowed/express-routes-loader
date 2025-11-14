import fs from "fs";
import path from "path";
import { LoadedRouteModule } from "../types";
import { isJs, isTs, cleanModuleName, resolveBuildPath } from "./utils";
import  Logger  from "./logger";

export function scanRouteModules(
  folder: string,
  env: string,
  hideLogs: boolean,
): LoadedRouteModule[] {
  const files = fs.readdirSync(folder);
  const modules: LoadedRouteModule[] = [];

  for (const file of files) {
    if (
      (!isJs(file) && !isTs(file)) ||
      file === "index.ts" ||
      file.endsWith(".d.ts")
    )
      continue;

    const moduleName = cleanModuleName(file);
    const absPath = path.join(folder, file);

    try {
      const required = require(resolveBuildPath(absPath, env));
      const routes = required.default;

      if (!Array.isArray(routes)) {
        if (!hideLogs)
          Logger.warn(
            `Invalid route export in ${file}. Must export default array.`,
          );
        continue;
      }

      modules.push({
        prefix: moduleName,
        routes,
      });
    } catch (err: any) {
      if (!hideLogs) Logger.error(`Failed loading ${file}: ${err.message}`);
    }
  }

  return modules;
}
