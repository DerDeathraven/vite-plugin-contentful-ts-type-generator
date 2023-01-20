"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatArray = exports.mapToStringArray = void 0;
const mapToStringArray = (arr) => arr.map((validValue) => `'${validValue}'`);
exports.mapToStringArray = mapToStringArray;
const formatArray = (isArray, typeName) => isArray ? `ReadonlyArray<${typeName}>` : typeName;
exports.formatArray = formatArray;
