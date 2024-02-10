const mdColors = [
  "#F44336",
  "#FFCDD2",
  "#EF9A9A",
  "#E57373",
  "#EF5350",
  "#F44336",
  "#E53935",
  "#D32F2F",
  "#C62828",
  "#FF8A80",
  "#FF5252",
  "#FF1744",
  "#E91E63",
  "#F8BBD0",
  "#F48FB1",
  "#F06292",
  "#EC407A",
  "#E91E63",
  "#D81B60",
  "#C2185B",
  "#AD1457",
  "#880E4F",
  "#FF80AB",
  "#FF4081",
  "#F50057",
  "#C51162",
  "#9C27B0",
  "#E1BEE7",
  "#CE93D8",
  "#BA68C8",
  "#AB47BC",
  "#9C27B0",
  "#8E24AA",
  "#7B1FA2",
  "#6A1B9A",
  "#EA80FC",
  "#E040FB",
  "#D500F9",
  "#AA00FF",
  "#673AB7",
  "#D1C4E9",
  "#B39DDB",
  "#9575CD",
  "#7E57C2",
  "#673AB7",
  "#5E35B1",
  "#512DA8",
  "#4527A0",
  "#B388FF",
  "#7C4DFF",
  "#651FFF",
  "#6200EA",
  "#3F51B5",
  "#C5CAE9",
  "#9FA8DA",
  "#7986CB",
  "#5C6BC0",
  "#3F51B5",
  "#3949AB",
  "#303F9F",
  "#283593",
  "#8C9EFF",
  "#536DFE",
  "#3D5AFE",
  "#2196F3",
  "#BBDEFB",
  "#90CAF9",
  "#64B5F6",
  "#42A5F5",
  "#2196F3",
  "#1E88E5",
  "#1976D2",
  "#1565C0",
  "#82B1FF",
  "#448AFF",
  "#2979FF",
  "#2962FF",
  "#03A9F4",
  "#B3E5FC",
  "#81D4FA",
  "#4FC3F7",
  "#29B6F6",
  "#03A9F4",
  "#039BE5",
  "#0288D1",
  "#0277BD",
  "#80D8FF",
  "#40C4FF",
  "#00B0FF",
  "#0091EA",
  "#00BCD4",
  "#B2EBF2",
  "#80DEEA",
  "#4DD0E1",
  "#26C6DA",
  "#00BCD4",
  "#00ACC1",
  "#84FFFF",
  "#18FFFF",
  "#00E5FF",
  "#B2DFDB",
  "#80CBC4",
  "#4DB6AC",
  "#26A69A",
  "#009688",
  "#00796B",
  "#00695C",
  "#A7FFEB",
  "#64FFDA",
  "#1DE9B6",
  "#00BFA5",
  "#4CAF50",
  "#C8E6C9",
  "#A5D6A7",
  "#81C784",
  "#66BB6A",
  "#4CAF50",
  "#43A047",
  "#2E7D32",
  "#B9F6CA",
  "#69F0AE",
  "#00E676",
  "#00C853",
  "#8BC34A",
  "#DCEDC8",
  "#C5E1A5",
  "#AED581",
  "#9CCC65",
  "#8BC34A",
  "#7CB342",
  "#689F38",
  "#CCFF90",
  "#B2FF59",
  "#76FF03",
  "#64DD17",
  "#CDDC39",
  "#F0F4C3",
  "#E6EE9C",
  "#DCE775",
  "#D4E157",
  "#CDDC39",
  "#C0CA33",
  "#AFB42B",
  "#F4FF81",
  "#EEFF41",
  "#C6FF00",
  "#AEEA00",
  "#FFEB3B",
  "#FFF9C4",
  "#FFF59D",
  "#FFF176",
  "#FFEE58",
  "#FFEB3B",
  "#FDD835",
  "#FBC02D",
  "#F9A825",
  "#F57F17",
  "#FFFF8D",
  "#FFFF00",
  "#FFEA00",
  "#FFD600",
  "#FFC107",
  "#FFECB3",
  "#FFE082",
  "#FFD54F",
  "#FFCA28",
  "#FFC107",
  "#FFB300",
  "#FFA000",
  "#FF8F00",
  "#FF6F00",
  "#FFE57F",
  "#FFD740",
  "#FFC400",
  "#FFAB00",
  "#FF9800",
  "#FFE0B2",
  "#FFCC80",
  "#FFB74D",
  "#FFA726",
  "#FF9800",
  "#FB8C00",
  "#F57C00",
  "#EF6C00",
  "#FFD180",
  "#FFAB40",
  "#FF9100",
  "#FF6D00",
  "#FFCCBC",
  "#FFAB91",
  "#FF8A65",
  "#FF7043",
  "#FF5722",
  "#F4511E",
  "#E64A19",
  "#FF9E80",
  "#FF6E40",
  "#FF3D00",
  "#795548",
  "#D7CCC8",
  "#BCAAA4",
  "#A1887F",
  "#8D6E63",
  "#795548",
  "#6D4C41",
  "#5D4037",
  "#4E342E",
  "#9E9E9E",
  "#E0E0E0",
  "#BDBDBD",
  "#9E9E9E",
  "#757575",
  "#616161",
  "#424242",
  "#CFD8DC",
  "#B0BEC5",
  "#90A4AE",
  "#78909C",
  "#607D8B",
  "#546E7A",
  "#455A64",
  "#37474F",
];

type StoredColors = {
  id: string;
  color: string;
}[];

function getNewColor(storedColors: StoredColors, id: string) {
  const newColor =
    mdColors[Math.floor(Math.random() * (mdColors.length - 0) + 1)];

  storedColors.push({ id, color: newColor });
  localStorage.setItem("colors", JSON.stringify(storedColors));
  return newColor;
}

export function getColor(
  id: string | undefined,
  darken: boolean = false,
  isOtherTripleSelected: boolean = false,
) {
  if (!id) {
    return "#fff";
  }
  const storedColors = localStorage.getItem("colors");

  const alpha = isOtherTripleSelected ? 0.25 : darken ? 0.9 : 0.6;
  if (!storedColors) {
    const newColor = getNewColor([], id);
    const rgba = hexToRGB(newColor, alpha);
    return rgba;
  }
  const usedColors = JSON.parse(storedColors);
  const color = usedColors.find(
    (usedColor: StoredColors[0]) => usedColor.id === id,
  );
  if (color) {
    const rgba = hexToRGB(color.color, alpha);
    return rgba;
  }

  const newColor = getNewColor(usedColors, id);
  const rgba = hexToRGB(newColor, alpha);
  return rgba;
}

function hexToRGB(hex: string, alpha: number) {
  const r = parseInt(hex?.slice(1, 3), 16),
    g = parseInt(hex?.slice(3, 5), 16),
    b = parseInt(hex?.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

export function computeColorFromRgbaAndBackgroundIntoRgb(
  rgba: string,
  background: string,
) {
  //   https://stackoverflow.com/a/3943023/10247962
  const rgb = rgba
    .replace(/^rgba?\(|\s+|\)$/g, "")
    .split(",")
    .map(Number);
  const alpha = rgb[3];
  const backgroundRgb = background
    .replace(/^rgba?\(|\s+|\)$/g, "")
    .split(",")
    .map(Number);
  const rgbComputed = rgb.map((color, index) =>
    Math.round(alpha * (color - backgroundRgb[index]) + backgroundRgb[index]),
  );
  return `rgba(${rgbComputed.join(",").replace("NaN", "")} 1)`;
}
