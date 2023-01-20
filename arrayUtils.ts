export const mapToStringArray = (arr: any[]) =>
  arr.map((validValue) => `'${validValue}'`);

export const formatArray = (isArray: boolean, typeName: string) =>
  isArray ? `ReadonlyArray<${typeName}>` : typeName;
