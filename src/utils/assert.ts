export function assert<T>(value: T, message?: string): asserts value {
  if (!value) {
    throw new Error (`Assertion failed\n${message}`);
  }
}
