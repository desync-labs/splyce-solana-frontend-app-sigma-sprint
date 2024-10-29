export const encodeStr = (str?: string, showNum = 3, dotNum = 2) => {
  if (!str) return "";
  return [
    str.slice(0, showNum),
    ".".repeat(dotNum),
    str.slice(-1 * showNum),
  ].join("");
};
