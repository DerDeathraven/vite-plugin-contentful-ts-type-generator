"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContentfulTypesPlugin = void 0;
const generateContentfullTypes_1 = __importDefault(require("./generateContentfullTypes"));
function generateContentfulTypesPlugin(options) {
    return {
        name: "contentful-types",
        buildStart() {
            console.log("[ContenfulTypesPlugin] Generating contentful types");
            const { spaceID, token, outputDir, host, environment, prefix, ignoredFields, } = options;
            (0, generateContentfullTypes_1.default)(spaceID, token, outputDir, host, environment, prefix, ignoredFields);
            console.log("[ContenfulTypesPlugin] Generated Types");
        },
    };
}
exports.generateContentfulTypesPlugin = generateContentfulTypesPlugin;
