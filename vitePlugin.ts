import { PluginOption } from "vite";
import generateContentfulTypes from "./generateContentfullTypes";

export type Options = {
  spaceID: string;
  token: string;
  outputDir?: string;
  host?: string;
  environment?: string;
  prefix?: string;
  ignoredFields?: string[];
};

export default function generateContentfulTypesPlugin(options: Options) {
  return {
    name: "contentful-types",
    buildStart() {
      console.log("[ContenfulTypesPlugin] Generating contentful types");
      const {
        spaceID,
        token,
        outputDir,
        host,
        environment,
        prefix,
        ignoredFields,
      } = options;
      generateContentfulTypes(
        spaceID,
        token,
        outputDir,
        host,
        environment,
        prefix,
        ignoredFields
      );
      console.log("[ContenfulTypesPlugin] Generated Types");
    },
  } as PluginOption;
}
