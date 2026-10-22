
import { NODE_ENV } from "../config.js";

export const globalErrorHandling = (error, req, res, next) => {
  console.error(error);

  return res.status(error.cause?.status ?? 500).json({
    error_message: error.message || "server error",
    cause: error.cause?.message || error.cause || undefined,
    stack: NODE_ENV === "production" ? undefined : error.stack,
  });
};
