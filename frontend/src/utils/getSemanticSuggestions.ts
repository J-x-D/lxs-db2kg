import { Prefix } from "types/Prefixes";
import axios from "axios";

/**
 * The type of the Result of the Semantic Search Result
 *
 * @export SemanticResult
 * @interface SemanticResult
 * @property {string} prefix The Prefix of the Predicate
 * @property {string} uri The URI of the Predicate
 */
export interface SemanticResult {
  /** The Prefix of the Predicate */
  prefix: string;
  uri: string;
}

/**
 * Calls the LOV API to get the Semantic Suggestions for the given Predicate
 * @param predicate - The Predicate to search for
 * @returns A promise that resolves to an array of Semantic Suggestions
 *
 * @example
 * const suggestions = await getSuggestions("foaf:firstName");
 * console.log(suggestions);
 * // ["foaf:firstName", "foaf:lastName", "foaf:givenName", "foaf:familyName", "foaf:name", "foaf:firstName", "foaf:lastName", "foaf:givenName", "foaf:familyName", "foaf:name"]
 */
const getSuggestions = async (predicate: string): Promise<string[]> => {
  // split by : and take last element
  const predicateName = predicate.split(":").pop();


  try {
    const response = await axios.get(
      `https://lov.linkeddata.es/dataset/lov/api/v2/term/suggest?q=${predicateName}&type=property`
    );
    return response.data.suggestions.map((s: any) => s.text);

  } catch (error) {
    console.error(error);
    return []

  }

};

/**
 * Calls the LOV API to get the Semantic Search Results for the given Prefixes and Predicate
 * @param prefixes - The Prefixes to search for
 * @param predicate - The Predicate to search for
 * @returns
 */
const getSearchResults = async (
  predicate: string,
  prefixes: Prefix[]
): Promise<SemanticResult[]> => {
  const suggestions = await getSuggestions(predicate);

  const results = await Promise.all(
    prefixes.map(async (p) => {
      const prefixResults = await Promise.all(
        suggestions.map(async (s) => {
          const q = s.split(":").pop();
          const response = await axios.get(
            `https://lov.linkeddata.es/dataset/lov/api/v2/term/search`,
            {
              params: {
                q,
                type: "property",
                vocab: p.prefix,
              },
            }
          );
          return response.data.results.map(
            (r: { prefixedName: string[]; uri: string[] }) => {
              return {
                prefix: r.prefixedName[0],
                uri: r.uri[0],
              };
            }
          );
        })
      );
      return prefixResults.flat();
    })
  );

  return results.flat();
};

/**
 * Gets some semantic suggestions based on the current predicate when no text was entered
 * @param predicate The current predicate
 * @returns A promise that resolves to an array of SemanticSuggestion objects
 */
export default async function getSemanticSuggestions(
  predicate: string,
  prefixes: Prefix[]
): Promise<SemanticResult[]> {
  const results = await getSearchResults(predicate, prefixes);
  return results;
}
