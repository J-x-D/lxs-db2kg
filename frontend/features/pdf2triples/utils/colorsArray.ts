// palette from http://vrl.cs.brown.edu/color
// settings:
//  - 16 colors
//  - 100% - perceptual distance
//  - 0% - Name Difference
//  - 0% - Pair Preference
//  - 0% - Name Uniqueness
//  - No Hue Filters
//  - 30 - 70 - Lightness Range

export const colorsArray = [
  "#68affc",
  "#37c51d",
  "#bd4ef6",
  "#9bb64b",
  "#c02a85",
  "#167b2b",
  "#fc2c44",
  "#2bbcce",
  "#974448",
  "#1d686e",
  "#f68aad",
  "#4443b4",
  "#fb9046",
  "#8184fb",
  "#856619",
  "#caa1a3",
];

export const getColorFromIndex = (index: number) => {
  return colorsArray[index % colorsArray.length];
};
