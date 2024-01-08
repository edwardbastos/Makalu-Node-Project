let codeCounter = 1;

export const generateErrorCode = () => {
  const code = `E${codeCounter.toString().padStart(3, "0")}`;
  codeCounter += 1;
  return code;
};

export const errorCodes = {
  ValidationError: generateErrorCode(),
};
