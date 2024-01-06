import fs from "fs";
import path from "path";
import { generateErrorCode } from "../dictionaries/errorCodes.js";
import ErrorsDictionary from "../dictionaries/errors.js";
import __dirname from "../utils.js";

class MyCustomError {
  constructor(filePath) {
    this.path = path.join(__dirname, filePath);
  }

  addError(error) {
    const newError = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: errorCodes[error.name] || generateErrorCode(),
      timestamp: new Date().toISOString(),
    };

    try {
      const errors = fs.existsSync(this.path)
        ? JSON.parse(fs.readFileSync(this.path))
        : [];

      errors.push(newError);
      fs.writeFileSync(this.path, JSON.stringify(errors, null, 2));
    } catch (writeError) {
      console.error("Error writing error to file:", writeError);
    }
  }
}

const myErrorHandler = (error, next) => {
  const knownError = ErrorsDictionary[error.name];

  if (knownError) {
    const customError = new Error(error.message);
    customError.name = knownError;
    customError.code = errorCodes[knownError];
    next(customError);
  } else {
    const customErrorInstance = new MyCustomError("../src/helpers/errors.json");
    customErrorInstance.addError(error);

    console.error("Unknown error occurred. Check errors.json for details.");

    next(error);
  }
};

export default myErrorHandler;
