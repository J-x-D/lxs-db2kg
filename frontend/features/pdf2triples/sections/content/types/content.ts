
export type TextTriple = {
  subject: {
    words: string;
    value: string;
    class: {
      class: string;
      score: number;
    }
  };
  predicate: {
    words: string;
    value: string;
    property: {
      property: string;
      score: number;
    }
  };
  object: {
    words: string;
    value: string;
    class: {
      class: string;
      score: number;
    }
  }
};


export const EXPECTED_TRIPLES_STRUCTURE: string = `
[
  {
    content: string;
    hasTriple: boolean;
    triple: {
      subject: string;
      predicate: {
        label: string | undefined;
        value: string;
        url: string;
      },
      object: string;
    }
]
`;
