interface WithId {
  id: string;
}

export function arrayToObject<T extends WithId>(
  array: T[] | undefined
): Record<string, Omit<T, keyof WithId>> {
  if (!array) {
    return {};
  }

  return array.reduce((previous, value) => {
    return {
      ...previous,
      [value.id]: {
        ...value,
        id: undefined,
      },
    };
  }, {});
}
