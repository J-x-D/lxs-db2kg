import { Prefix } from "types/Prefixes";

export function formatOntologiesToPrefixes(
  urls: (string | undefined)[]
): Prefix[] {
  const prefixes: Prefix[] = [];
  urls.forEach((url) => {
    // remove http:// or https://
    const urlWithoutProtocol = url?.replace(/(^\w+:|^)\/\//, "");

    // remove everything after the last .
    const urlWithoutProtocolAndLastDot = urlWithoutProtocol?.replace(
      /\.[^/.]+$/,
      ""
    );

    // replace all non-alphanumeric characters with _
    const prefix = urlWithoutProtocolAndLastDot?.replace(/\W/g, "_");
    prefixes.push({
      prefix: prefix || "",
      url: url || "",
    });
  });

  return prefixes;
}
