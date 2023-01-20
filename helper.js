"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toInterfaceName = exports.linkFormatter = exports.concatLinkTypes = exports.formatMap = void 0;
const arrayUtils_1 = require("./arrayUtils");
function formatMap(field, prefix = "", isArray = false) {
    const type = field === null || field === void 0 ? void 0 : field.type;
    if (!type)
        return "any";
    const dataMap = {
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
    if (dataMap[type])
        return dataMap[type];
    console.log(field);
    console.warn(`Unknown field type: ${type} in field ${field.id}`);
    return (0, arrayUtils_1.formatArray)(isArray, "any");
}
exports.formatMap = formatMap;
function dateFormatter(field, isArray) {
    const specificValuesValidation = field.validations &&
        field.validations.find((validation) => validation.hasOwnProperty("in"));
    if (specificValuesValidation) {
        console.log("specificValuesValidation", specificValuesValidation);
        return (0, arrayUtils_1.formatArray)(isArray, (0, arrayUtils_1.mapToStringArray)(specificValuesValidation.in).join("|"));
    }
    else {
        return (0, arrayUtils_1.formatArray)(isArray, "string");
    }
}
const concatLinkTypes = (prefix, linkContentType) => Array.isArray(linkContentType)
    ? linkContentType
        .map((type) => {
        return (0, exports.toInterfaceName)(type, prefix);
    })
        .join("|")
    : (0, exports.toInterfaceName)(linkContentType, prefix);
exports.concatLinkTypes = concatLinkTypes;
function linkFormatter(field, prefix, isArray) {
    if (field.linkType === "Asset") {
        return (0, arrayUtils_1.formatArray)(isArray, "Asset");
    }
    else if (field.linkType === "Entry") {
        const linkContentTypeValidation = field.validations &&
            field.validations.find((validation) => validation.hasOwnProperty("linkContentType"));
        if (linkContentTypeValidation) {
            const linkContentType = linkContentTypeValidation.linkContentType;
            const fieldTypes = (0, exports.concatLinkTypes)(prefix, linkContentType);
            return (0, arrayUtils_1.formatArray)(isArray, `Entry<${fieldTypes}>`);
        }
        else {
            return (0, arrayUtils_1.formatArray)(isArray, "any");
        }
    }
    else {
        return "any";
    }
}
exports.linkFormatter = linkFormatter;
const toInterfaceName = (string, prefix = "") => {
    string.replace(/-[[:alnum:]]/gm, (match) => {
        console.log("Match", match);
        return match.slice(1).toUpperCase();
    });
    return (prefix +
        string.charAt(0).toUpperCase() +
        string
            .slice(1)
            .replace(/-[A-Za-z0-9_]/g, (match) => match.slice(1).toUpperCase()));
};
exports.toInterfaceName = toInterfaceName;
