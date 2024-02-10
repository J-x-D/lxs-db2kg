import { LxsWords, lxsWordsSchema } from "features/pdf2triples/types/triple";

export default function stringToWords(string: string): LxsWords {
  // word separators: space, tab, newline, carriage return, form feed, ., -, ;
  // replace all "-" or other dash characters with " - " so that it is considered a word
  // string = string.replace(/[-‐‑‒–—―⁃−─━]/g, " - ");
  // add a space before and after all punctuation
  // string = string.replace(/([.,;!?])/g, " $1 ");
  // const wordSeparators = /[\s\t\n\r\f]/g;
  // string = string replace \n with space
  string = string.replace(/\n/g, " ");
  const words = string.split(" ").filter((word) => word !== "");
  const wordsWithIds = words.map((word, index) => {
    return { content: word, id: index + 1 };
  });

  try {
    lxsWordsSchema.parse(wordsWithIds);
  } catch (error) {
    console.error(error);
    return [];
  }

  return wordsWithIds;
}
