import { createClient } from "contentful";
import { TypeBuilder } from "./TypeBuilder";
import { writeFileSync } from "fs";
import { resolve } from "path";
export default async function generateContentfulTypes(
  space: string,
  accessToken: string,
  outputFilePath = "./contentfulTypes.d.ts",
  host = "cdn.contentful.com",
  environment = "master"
) {
  const client = createClient({
    host,
    environment,
    space,
    accessToken,
    resolveLinks: true,
  });
  const typeBuilder = new TypeBuilder(client);
  const writeString = await typeBuilder.buildTypes();
  const path = resolve(process.cwd(), outputFilePath);
  writeFileSync(path, writeString, "utf8");
}
