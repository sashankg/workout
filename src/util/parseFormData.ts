import { ZodSchema } from "zod";

type Tree = { [key: string]: Tree | string };

export default function parseFormData(data: FormData, schema: ZodSchema) {
  const tree = {};
  for (const [key, value] of data.entries()) {
    console.log(key);
    const parts = key.split(".");
    build(value.toString(), parts, tree);
  }
  console.log(arraify(tree));
  return schema.parse(arraify(tree));
}

function build(value: string, parts: string[], tree: Tree) {
  const existing = tree[parts[0]];
  if (parts.length === 0) {
    if (typeof existing === "object") {
      debugger;
      throw new Error(`Cannot overwrite object ${existing} with ${value}`);
    }
    return value;
  }
  if (!existing) {
    tree[parts[0]] = build(value, parts.slice(1), {});
  } else {
    if (typeof existing !== "object") {
      debugger;
      throw new Error(`Cannot overwrite ${existing} with ${parts}: ${value}`);
    }
    tree[parts[0]] = build(value, parts.slice(1), existing);
  }
  return tree;
}

function arraify(tree: Tree) {
  const result: any = {};
  for (const [key, value] of Object.entries(tree)) {
    if (typeof value === "object") {
      const subKeys = Object.keys(value);
      if (subKeys.length > 0 && !isNaN(parseInt(subKeys[0]))) {
        result[key] = Object.keys(value).map((index) => {
          const subValue = value[index];
          if (typeof subValue === "object") {
            return arraify(subValue);
          }
          return subValue;
        });
      }
    }
    return result;
  }
}
