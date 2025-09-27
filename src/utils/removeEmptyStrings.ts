export const removeEmptyStrings = <T extends object>(
  obj: T,
  deep?: boolean,
): T => {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === 'string' && value.trim() === '') {
      continue;
    }

    if (deep && typeof value === 'object' && value !== null) {
      const cleanedValue = removeEmptyStrings(
        value as Record<string, unknown>,
        deep,
      );

      if (Object.keys(cleanedValue).length > 0) {
        result[key] = cleanedValue;
      }
    } else {
      result[key] = value;
    }
  }

  return result as T;
};
