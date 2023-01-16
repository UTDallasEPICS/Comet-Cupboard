import Joi from "joi";
import express from "express";
import httpStatus from "http-status";

function sendJoiValidationError(error: Joi.ValidationError): Record<string, string> {
  const errors: Record<string, string> = {
    message: "Some data is invalid."
  };
  const errorData = error.details;
  for (let k = 0; k < errorData.length; k++) {
    const fieldData = errorData[k].path;
    const field = fieldData.join(".");
    errors[field] = errorData[k].message.split('"').join("");
  }
  return errors;
}

// handle 200 and 404
export function httpErrorHandler(
  err: Record<string, unknown>,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  console.log("went straight to 500");

  if (err && err.status && err.status === 200) {
    delete err.status;
    res.send(err);
  } else if (err && err.status && err.status === 404 && !err.message) {
    res.status(404).send({ message: "Endpoint not found" });
  } else {
    next(err);
  }
}

// handle joi and mongo errors
export function validationErrorHandler(
  err: Record<string, unknown>,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  if (err instanceof Joi.ValidationError) {
    // Joi validation error
    console.warn(JSON.stringify(err.details, null, 2));
    res.status(httpStatus.BAD_REQUEST).send({
      message: "Some fields are invalid",
      errors: sendJoiValidationError(err)
    });
  } else if (err.status && err.message) {
    // general error
    console.warn(JSON.stringify(err, null, 2));
    res.status(err.status as number).send({
      message: err.message,
      errors: err.errors,
      detail: err.detail,
      code: err.code
    });
  } else {
    // internal (uncaught) error
    next(err);
  }
}

// handle internal errors
export function internalErrorHandler(
  err: Record<string, unknown>,
  req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: express.NextFunction
): void {
  console.error(err);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: "An internal error occurred. Wait a few minutes and try again."
  });
}