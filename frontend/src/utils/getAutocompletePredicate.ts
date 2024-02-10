import { Prefix } from "types/Prefixes";
import axios from "axios";
import { prefixPredicate } from "./prefixPredicate";

export interface AutocompletePredicate {
  lov: string[];
  semantic: string[];
}

interface SemanticSuggestion {
  predicate: string;
  uri: string;
}

async function getLovAutocomplete(
  predicate: string,
  prefix: string,
): Promise<string[]> {
  const url = `https://lov.linkeddata.es/dataset/lov/api/v2/term/autocomplete?type=property&q=${prefix}:${predicate}`;
  const suggestions = await axios
    .get(url)
    .then((response) => response.data.results)
    .catch((error) => {
      console.error(error);
      return [];
    });

  const prefixOptions = suggestions.map(
    (suggestion: {
      prefixedName: string[];
      localName: string;
      score: number;
      type: string;
      uri: string[];
    }) => suggestion.prefixedName[0],
  );
  return prefixOptions;
}

async function getSemanticAutocomplete({
  predicate,
  ontologyUrls,
  prefixes,
}: {
  predicate: string;
  ontologyUrls: (string | undefined)[];
  prefixes: Prefix[];
}): Promise<string[]> {
  const endpoint = "get_semantically_closest_properties";

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${endpoint}`;
  const suggestions = await axios
    .post(url, {
      search: predicate,
      urls: ontologyUrls,
    })
    .then((response) => response.data)

    .catch((error) => {
      console.error(error);
      return [];
    });

  const formattedSuggestions = suggestions.map((suggestion: string) => {
    return prefixPredicate(suggestion, prefixes);
  });

  return formattedSuggestions;
}

/**
 * Get Options for Autocomplete using the search term (only searches for suffixes)
 * @param searchTerm - A string to search for in the prefixes
 * @returns A promise that resolves to an object with two arrays of strings: lov and semantic
 */
export default async function getAutocompletePredicate(
  searchTerm: string,
  prefixes: Prefix[],
  ontologyUrls: (string | undefined)[],
): Promise<AutocompletePredicate> {
  return new Promise(async (resolve, reject) => {
    const lovResults: string[] = (
      await Promise.all(
        prefixes.map(async (prefix) => {
          return await getLovAutocomplete(searchTerm, prefix.prefix);
        }),
      )
    ).flat();

    const semanticResults: string[] = (
      await getSemanticAutocomplete({
        predicate: searchTerm,
        ontologyUrls,
        prefixes,
      })
    ).sort();

    resolve({
      lov: lovResults,
      semantic: semanticResults.map((suggestion) => suggestion),
    });

    reject("Error getting autocomplete results");
  });
}
