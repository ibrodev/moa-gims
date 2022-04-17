module.exports = {
  // No changes detected error
  NoChangesDetected: () => {
    const error = new Error("No changes detected");
    error.name = "NoChangesDetectedError";
    return error;
  },
};
