export const recursiveStrip = (obj: any, n = 0) => {
  if (!obj) return {};
  if (n > 2) return {};
  return Object.keys(obj).reduce((prev: any, key: string) => {
    if (
      typeof obj[key] == "string" ||
      typeof obj[key] == "number" ||
      typeof obj[key] == "boolean"
    ) {
      prev[key] = obj[key];
    } else if (typeof obj[key] == "object") {
      const val = recursiveStrip(obj[key], n + 1);
      prev[key] = val;
    }
    return prev;
  }, {});
};
