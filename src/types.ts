import { RequestHandler } from "express";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export type RouteHandler = {
  path: string;
  method: HttpMethod;
  handlers: RequestHandler[];
};
export type LoadedRouteModule = {
  prefix: string;
  routes: RouteHandler[];
}

export type LoadRouteOptions = {
  prefix?: string;
  env?: string;
  wildcardHandler?: RequestHandler;
  hideLogs?: boolean;
}