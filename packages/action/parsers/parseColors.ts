import type { DrawOptions } from "@snk/svg-creator";
import { palettes } from "../palettes";

export function parseColors(searchParams: URLSearchParams) {
  const drawColors: Pick<
    DrawOptions,
    "colorDotBorder" | "colorDots" | "colorEmpty" | "colorSnake" | "dark"
  > = {
    ...palettes["default"],
    dark: palettes["default"].dark && { ...palettes["default"].dark },
  };

  {
    const palette = palettes[searchParams.get("palette")!];
    if (palette) {
      Object.assign(drawColors, palette);
      drawColors.dark = palette.dark && { ...palette.dark };
    }
  }

  {
    const dark_palette = palettes[searchParams.get("dark_palette")!];
    if (dark_palette) {
      const clone = { ...dark_palette, dark: undefined };
      drawColors.dark = clone;
    }
  }

  if (searchParams.has("color_snake")) {
    drawColors.colorSnake = searchParams.get("color_snake")!;
  }

  if (searchParams.has("color_dots")) {
    const colors = searchParams.get("color_dots")!.split(/[,;]/);
    drawColors.colorDots = colors;
    drawColors.colorEmpty = colors[0];
    drawColors.dark = undefined;
  }

  if (searchParams.has("color_dot_border")) {
    drawColors.colorDotBorder = searchParams.get("color_dot_border")!;
  }

  if (searchParams.has("dark_color_dots")) {
    const colors = searchParams.get("dark_color_dots")!.split(/[,;]/);
    drawColors.dark = {
      colorDotBorder: drawColors.colorDotBorder,
      colorSnake: drawColors.colorSnake,
      ...drawColors.dark,
      colorDots: colors,
      colorEmpty: colors[0],
    };
  }

  if (searchParams.has("dark_color_dot_border") && drawColors.dark) {
    drawColors.dark.colorDotBorder = searchParams.get("color_dot_border")!;
  }

  if (searchParams.has("dark_color_snake") && drawColors.dark) {
    drawColors.dark.colorSnake = searchParams.get("color_snake")!;
  }

  return drawColors;
}
