import { ContentfulClientApi } from "contentful";
import { formatMap, isDate, toInterfaceName } from "./helper";

export class TypeBuilder {
  private outputString: string = "";
  private enumEntries: string[] = [];
  constructor(private client: ContentfulClientApi) {
    this.client = client;
    this.outputString = ``;
    this.enumEntries = [];
  }

  /**
   * Pulls and sorts the types from the api
   * @returns
   */
  private fetchTypes = async () => {
    const response = await this.client.getContentTypes();
    const sortedItems = response.items.sort((a, b) =>
      toInterfaceName(a.sys.id).localeCompare(toInterfaceName(b.sys.id))
    );
    return sortedItems;
  };

  /**
   * simple helper function to add a string and a linebreak
   * @param string
   */
  private addToOutput(string: string) {
    this.outputString += `\n` + string;
  }

  /**
   * Connects the header with the output string
   * the Header includes the Enum for all the fieldNames
   * @returns
   */
  private buildOutputString() {
    const headerString = `import { Entry, Asset } from 'contentful'\n
    export enum ContentfulType {
        ${this.formatEnumEntries()}
    }
    ${this.buildTypeFactory()}
    ${this.outputString}
    
    `;
    return headerString;
  }
  private buildTypeFactory() {
    let string = `export type ContentfulEntries<T extends ContentfulType> = \n `;
    for (let i = 0; i < this.enumEntries.length; i++) {
      const enumEntry = this.enumEntries[i];
      if (i < this.enumEntries.length - 1) {
        string += `T extends '${enumEntry}' ? ${toInterfaceName(enumEntry)}:\n`;
      } else {
        string += toInterfaceName(enumEntry) + `\n`;
      }
    }
    return string;
  }

  /**
   * Builds a enum list
   * @returns
   */
  private formatEnumEntries() {
    let retString = ``;
    for (const enumEntry of this.enumEntries) {
      retString += `${toInterfaceName(enumEntry)}='${enumEntry}',\n`;
    }
    return retString;
  }

  /**
   * Checks if a given field is a viable string to be considered as a const so that it can be easier used in code
   * @param type
   * @param field
   * @returns
   */
  private async checkForViableConst(type: string, field: string) {
    field = field.toLowerCase();
    const response = await this.client.getEntries<any>({
      content_type: type,
    });

    if (response.items.length > 20) return;

    let types = [];
    let stringToLong = false;

    for (const entry of response.items) {
      //iterate through all entries and make sure that they are not to long
      const fieldString = entry.fields[field] as string;

      if (!fieldString || stringToLong) continue;
      //if its a date or longer than 50 chars, it doesnt make sense to cache this entry
      if (!(fieldString.length > 50 || isDate(fieldString))) {
        types.push(`'${fieldString.replace(/'/g, "\\'")}' `);
      } else {
        stringToLong = true;
      }
    }
    //removes all duplicates
    types = [...new Set(types)];
    const returnString = types.join(" | ");

    return stringToLong ? undefined : returnString;
  }

  /**
   * creates a output string build so that it can be used as a d.ts file
   */
  async buildTypes(): Promise<string> {
    const types = await this.fetchTypes();

    for (const type of types) {
      this.enumEntries.push(type.sys.id);
      const fields = type.fields.sort((a, b) => a.id.localeCompare(b.id));
      this.addToOutput(`export interface ${toInterfaceName(type.sys.id)} {`);

      for (const field of fields) {
        if (field.omitted === true) continue;
        let typeString = formatMap(field);

        if (typeString === "string") {
          const constString = await this.checkForViableConst(
            type.sys.id,
            field.name
          );
          typeString = constString ? constString : typeString;
        }
        const nullable = field.required ? "" : "?";
        this.addToOutput(`  readonly ${field.id}${nullable}: ${typeString}`);
      }

      this.addToOutput(`}`);
    }

    return this.buildOutputString();
  }
}
