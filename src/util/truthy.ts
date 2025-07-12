export default function truthy<T>(x: T | undefined): x is T {
  return x !== undefined;
}
