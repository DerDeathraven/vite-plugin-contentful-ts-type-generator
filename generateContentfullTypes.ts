import { ContentTypeCollection, createClient } from "contentful";
import { formatMap, toInterfaceName } from "./helper";
import { createWriteStream } from "fs";
export default async function generateContentfulTypes(
  space: string,
  accessToken: string,
  outputFilePath = "./contentfulTypes.d.ts",
  host = "cdn.contentful.com",
  environment = "master",
  prefix = "",
  ignoredFields: string[] = []
) {
  const client = createClient({
    host,
    environment,
    space,
    accessToken,
    resolveLinks: true,
  });
  const types = await client.getContentTypes();
  writeTypesToFile(types, outputFilePath, prefix, ignoredFields);
}

const writeTypesToFile = (
  types: ContentTypeCollection,
  outputFilePath: string,
  prefix: string,
  ignoredFields: string[]
) => {
  const items = types.items;
  var stream = createWriteStream(outputFilePath);
  stream.once("open", () => {
    stream.write(`import { Entry, Asset } from 'contentful'\n`);
    items
      .sort((a, b) =>
        toInterfaceName(a.sys.id, prefix).localeCompare(
          toInterfaceName(b.sys.id, prefix)
        )
      )
      .forEach((item) => {
        stream.write(
          `export const ${toInterfaceName(item.sys.id, prefix)} = '${
            item.sys.id
          }'\n`
        );
        stream.write(
          `export interface ${toInterfaceName(item.sys.id, prefix)} {\n`
        );
        stream.write(`  //${item.name}\n`);
        stream.write(`  /* ${item.description} */\n`);
        item.fields
          .sort((a, b) => a.id.localeCompare(b.id))
          .forEach((field) => {
            if (field.omitted !== true && !ignoredFields.includes(field.id)) {
              var type = formatMap(field, prefix);
              var nullable = field.required === true ? "" : "?";
              stream.write(`  readonly ${field.id}${nullable}: ${type}\n`);
            }
          });
        stream.write(`}\n\n`);
      });
    stream.end();
  });
};


