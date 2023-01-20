"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const contentful_1 = require("contentful");
const helper_1 = require("./helper");
const fs_1 = require("fs");
function generateContentfulTypes(space, accessToken, outputFilePath = "./contentfulTypes.d.ts", host = "cdn.contentful.com", environment = "master", prefix = "", ignoredFields = []) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = (0, contentful_1.createClient)({
            host,
            environment,
            space,
            accessToken,
            resolveLinks: true,
        });
        const types = yield client.getContentTypes();
        writeTypesToFile(types, outputFilePath, prefix, ignoredFields);
    });
}
exports.default = generateContentfulTypes;
const writeTypesToFile = (types, outputFilePath, prefix, ignoredFields) => {
    const items = types.items;
    var stream = (0, fs_1.createWriteStream)(outputFilePath);
    stream.once("open", () => {
        stream.write(`import { Entry, Asset } from 'contentful'\n`);
        items
            .sort((a, b) => (0, helper_1.toInterfaceName)(a.sys.id, prefix).localeCompare((0, helper_1.toInterfaceName)(b.sys.id, prefix)))
            .forEach((item) => {
            stream.write(`export const ${(0, helper_1.toInterfaceName)(item.sys.id, prefix)} = '${item.sys.id}'\n`);
            stream.write(`export interface ${(0, helper_1.toInterfaceName)(item.sys.id, prefix)} {\n`);
            stream.write(`  //${item.name}\n`);
            stream.write(`  /* ${item.description} */\n`);
            item.fields
                .sort((a, b) => a.id.localeCompare(b.id))
                .forEach((field) => {
                if (field.omitted !== true && !ignoredFields.includes(field.id)) {
                    var type = (0, helper_1.formatMap)(field, prefix);
                    var nullable = field.required === true ? "" : "?";
                    stream.write(`  readonly ${field.id}${nullable}: ${type}\n`);
                }
            });
            stream.write(`}\n\n`);
        });
        stream.end();
    });
};
generateContentfulTypes("e8fwbhul2hwb", "J97KbbViiEIOgZf3MSTBE3ySkWYnwGMeSDLYFRv2JYM");
