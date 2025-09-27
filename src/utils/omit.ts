export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> =>
  Object.keys(obj)
    .filter((key) => !keys.includes(key as K))
    .reduce(
      (acc, key) => {
        (acc as T)[key as K] = obj[key as K];
        return acc;
      },
      {} as Omit<T, K>,
    );
