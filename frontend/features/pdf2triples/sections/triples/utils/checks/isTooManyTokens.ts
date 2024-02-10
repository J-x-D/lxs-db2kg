export const MAX_TOKENS = 2000;

type IsTooManyTokens = {
  string?: string;
  partial?: {
    partialText: string;
    generateFullText: boolean;
  };
};

export const isTooManyTokens = ({
  string,
  partial,
}: IsTooManyTokens): boolean => {
  if (!string) return false;
  if (partial && partial.generateFullText === false)
    return partial.partialText.length > MAX_TOKENS;

  const tokenLen = string.length;
  return tokenLen > MAX_TOKENS;
};
