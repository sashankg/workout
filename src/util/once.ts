export default function once<T>(promise: () => Promise<T>) {
  let result: Promise<T> | null = null;
  return () => {
    if (!result) {
      result = promise();
    }
    return result;
  };
}
