## converts the type generator to Typescript and exports a vite plugin

## Usage

1. Get preview api token and spaceId from Contentful.

2. Install this repository into your vite project

```
npm install github:arimkevi/contentful-ts-type-generator
```

3. add the plugin to your vite plugin array
4. watch as a file is created containing all types for your cms additionally an enum with all Contentful id is created.

````typescript

export async function fetchByContentType<T extends ContentFulType>(
  entry: T,
  options?: Object
): Promise<Entry<contentfulEntries<T>>[]> {
  try {
    const client = await getContentfulClient()
    const response = await client.getEntries<contentfulEntries<T>>({
      content_type: entry,
      ...(options || {}),
    })
    return response.items
  } catch (e) {
    console.error('Could not fetch contentful entries of the content type.', e)
    return []
  }
}```
````
