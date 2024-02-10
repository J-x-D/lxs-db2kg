import { getColor } from "src/color";
import { RDFResource } from "../types/triple";

export const setRgbOpacity = (color: string, opacity: number) => {
  const removedRgbAndBrackets = color.replace("rgb(", "").replace(")", "");
  const [r, g, b] = removedRgbAndBrackets
    .split(",")
    .filter((_, i) => i < 3)
    .map((c) => parseInt(c));
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const changeRgbaOpacity = (color: string, opacity: number) => {
  const removedRgbaAndBrackets = color.replace("rgba(", "").replace(")", "");
  const [r, g, b, a] = removedRgbaAndBrackets
    .split(",")
    .filter((_, i) => i < 4)
    .map((c) => parseFloat(c));
  return `rgba(${r}, ${g}, ${b}, ${a * opacity})`;
};

type Options = {
  opacityThisSelected?: number;
  opacityOtherSelected?: number;
  opacityNoneSelected?: number;
};

/**
 * Computes the color of a triple based on the selected triple and the options.
 * @param triple The triple for which the color should be computed.
 * @param selectedTriple The currently selected triple.
 * @param options The options for the color computation.
 * @param options.opacityThisSelected The opacity of the color if this triple is selected.
 * @param options.opacityOtherSelected The opacity of the color if this triple is not selected but another triple is selected.
 * @param options.opacityNoneSelected The opacity of the color if no triple is selected.
 * @returns An rgba color string.
 */
export const computeTripleColor = (
  triple: RDFResource,
  selectedTriple: RDFResource | null,
  options?: Options,
): string => {
  const {
    opacityThisSelected = 1,
    opacityOtherSelected = 0.5,
    opacityNoneSelected = 0.9,
  } = options || {};
  if (selectedTriple === null) return getColor(triple.id);

  const isThisSelected = selectedTriple['@id'] === triple['@id'];
  const isAnyTripleSelected = selectedTriple !== null;

  const color = getColor(triple.id);

  const colorWithOpacity = changeRgbaOpacity(
    color,
    isAnyTripleSelected
      ? isThisSelected
        ? opacityThisSelected
        : opacityOtherSelected
      : opacityNoneSelected,
  );
  return colorWithOpacity;
};
