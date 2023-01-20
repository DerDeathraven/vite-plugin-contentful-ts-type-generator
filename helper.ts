import { formatArray, mapToStringArray } from "./arrayUtils";

export function formatMap(field: any, prefix = "", isArray = false) {
  const type = field?.type;
  if (!type) return "any";
  const dataMap: Record<string, string> = {
    Text: dateFormatter(field, isArray),
    Symbol: dateFormatter(field, isArray),
    Date: dateFormatter(field, isArray),
    Number: "number",
    Integer: "number",
    Boolean: "boolean",
    Location: "{ lat:string, lon:string }",
    Object: "any",
    RichText: "{ content: any, data: any, nodeType: string }",
    Link: linkFormatter(field, prefix, isArray),
    Array: formatMap(field.items, prefix, true),
  };
  if (dataMap[type]) return dataMap[type];
  console.log(field);
  console.warn(`Unknown field type: ${type} in field ${field.id}`);
  return formatArray(isArray, "any");
}

function dateFormatter(field: any, isArray: boolean) {
  const specificValuesValidation =
    field.validations &&
    field.validations.find((validation: any) =>
      validation.hasOwnProperty("in")
    );
  if (specificValuesValidation) {
    console.log("specificValuesValidation", specificValuesValidation);
    return formatArray(
      isArray,
      mapToStringArray(specificValuesValidation.in).join("|")
    );
  } else {
    return formatArray(isArray, "string");
  }
}

export const concatLinkTypes = (
  prefix: string,
  linkContentType: any[] | string
) =>
  Array.isArray(linkContentType)
    ? linkContentType
        .map((type) => {
          return toInterfaceName(type, prefix);
        })
        .join("|")
    : toInterfaceName(linkContentType, prefix);

export function linkFormatter(field: any, prefix: string, isArray: boolean) {
  if (field.linkType === "Asset") {
    return formatArray(isArray, "Asset");
  } else if (field.linkType === "Entry") {
    const linkContentTypeValidation =
      field.validations &&
      field.validations.find((validation: any) =>
        validation.hasOwnProperty("linkContentType")
      );
    if (linkContentTypeValidation) {
      const linkContentType = linkContentTypeValidation.linkContentType;
      const fieldTypes = concatLinkTypes(prefix, linkContentType);
      return formatArray(isArray, `Entry<${fieldTypes}>`);
    } else {
      return formatArray(isArray, "any");
    }
  } else {
    return "any";
  }
}
export const toInterfaceName = (string: string, prefix = "") => {
  string.replace(/-[[:alnum:]]/gm, (match) => {
    console.log("Match", match);
    return match.slice(1).toUpperCase();
  });
  return (
    prefix +
    string.charAt(0).toUpperCase() +
    string
      .slice(1)
      .replace(/-[A-Za-z0-9_]/g, (match) => match.slice(1).toUpperCase())
  );
};
