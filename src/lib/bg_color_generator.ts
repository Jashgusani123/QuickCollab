export const generateDarkPalette = (count = 4) => {
  const avoidColors = [
    "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff",
    "#ffff00", "#ff8800", "#ffa500", "#800000", "#ff00ff",
  ];

  const randomHex = () => {
    const rand = () =>
      Math.floor(Math.random() * 156 + 50).toString(16).padStart(2, "0");
    return `#${rand()}${rand()}${rand()}`;
  };

  const colors: string[] = [];
  while (colors.length < count) {
    const color = randomHex().toLowerCase();
    if (!avoidColors.includes(color) && !colors.includes(color)) {
      colors.push(color);
    }
  }

  return colors.join("");
};
