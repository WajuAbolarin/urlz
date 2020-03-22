type UrlsConfig = Array<string | Object>;
const defindedPaths = {
  index: "",
  create: "new",
  view: "details",
  edit: "edit",
  dynamic: (id = "id") => `:${id}`
};
const Urls = (config: UrlsConfig = []) => {
  const rootProxy = {
    get(target: object, key: string): object | string {
      if (key in target) {
        return target[key];
      }
      throw new RangeError(`Undefined path ${key}`);
    },
    toString(...args: Array<any>) {
      return "Code by </Waju>";
    }
  };

  return new Proxy(mapPaths(config), rootProxy);
};
Urls.compile = (...args) => mapDynamic(...args);
const colon = new RegExp(`:`, "g");

const mapDynamic = (subPath: string, hash: object): string => {
  if (!hash) {
    throw new TypeError("Please pass a hash of values");
  }
  let result = subPath;
  Object.entries(hash).forEach(([key, value]: string[]) => {
    let reg = new RegExp(`${key}`, "g");
    result = result.replace(reg, value);
  });
  return result.replace(colon, "");
};
const modifyObjectValues = (obj = {}, fn: Function): object => {
  return Object.entries(obj).reduce((acc: object, [key, value]: string[]) => ({
    ...acc,
    [key]:
      typeof value === "function"
        ? function(...args: [string, object?]) {
            let [subPath = ":id", mappings] = args;
            if (mappings) {
              subPath = mapDynamic(subPath, mappings);
            }
            return fn.call(null, subPath);
          }
        : fn(value)
  }));
};
const appendRootToPath = (root: string, path: string): string =>
  `${root}/${path}`;

function mapPaths(config: object): object {
  return Object.values(config).reduce((target: object, path: string) => {
    const pathRoot = typeof path === "string" ? path : path.root;
    const basePaths =
      typeof path === "string"
        ? defindedPaths
        : path.paths.reduce(
            (acc: object, value: string) => ({ ...acc, [value]: value }),
            defindedPaths
          );
    return {
      ...target,
      [pathRoot]: modifyObjectValues(
        basePaths,
        appendRootToPath.bind(null, pathRoot)
      )
    };
  }, {});
}
export default Urls;
