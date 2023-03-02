import { Plugin, PluginOption } from "vite";
import generateContentfulTypes from "./generateContentfullTypes";

export type Options = {
  spaceID: string;
  token: string;
  outputDir?: string;
  host?: string;
  environment?: string;
};

let gotExecuted = false;

export default function generateContentfulTypesPlugin(options: Options) {
  return {
    name: "contentful-types",
    buildStart() {
      if (gotExecuted) return;
      console.log("[ContenfulTypesPlugin] Generating contentful types");
      const { spaceID, token, outputDir, host, environment } = options;
      generateContentfulTypes(
        spaceID,
        token,
        outputDir,
        host,
        environment
      ).then(() => {
        console.log("[ContenfulTypesPlugin] Generated Types");
        gotExecuted = true;
      });
    },
  } as Plugin;
}
