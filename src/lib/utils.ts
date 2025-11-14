export const isTs = (file: string) => file.endsWith(".ts");
export const isJs = (file: string) => file.endsWith(".js");

export const cleanModuleName = (file: string) => file.replace(/\.(ts|js)$/, "");

export const resolveBuildPath = (filePath: string, env: string) =>
  env === "development" ? filePath : filePath.replace(".ts", ".js");
