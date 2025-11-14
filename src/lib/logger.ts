import { logger } from "netwrap";

logger("Logger initialized from netwrap", { shouldLog: true, isError: false });

const Logger = {
  info: (...msg: any[]) => {
    logger(`[INFO] ${msg.join(" ")}`, { shouldLog: true, isError: false });
  },
  warn: (...msg: any[]) => {
    logger(`[WARN] ${msg.join(" ")}`, { shouldLog: true, isError: false });
  },
  error: (...msg: any[]) => {
    logger(`[ERROR] ${msg.join(" ")}`, { shouldLog: true, isError: true });
  },
};


export default Logger;