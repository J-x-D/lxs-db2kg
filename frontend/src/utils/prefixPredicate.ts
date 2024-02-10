import { Prefix } from "types/Prefixes";

export const prefixPredicate = (predicate: string, prefixes: Prefix[] = []) => {
  if (predicate === "") return predicate;

  const prefix = prefixes.find((prefix) => {
    // replace everything after the last . with nothing
    const urlWithoutProtocolAndLastDot = prefix.url.replace(/\.[^/.]+$/, "");
    return predicate.startsWith(urlWithoutProtocolAndLastDot);
  }) as Prefix;

  const urlWithoutOwlSuffix = prefix?.url.replace(/\.owl$/, "");

  return predicate
    .replace(urlWithoutOwlSuffix, prefix?.prefix + ":")
    .replaceAll("#", "")
    .replaceAll(".owl", "");
};
