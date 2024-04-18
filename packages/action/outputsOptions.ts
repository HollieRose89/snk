import type { AnimationOptions } from "@snk/gif-creator";
import type { DrawOptions as DrawOptions } from "@snk/svg-creator";
import { palettes } from "./palettes";

const DEFAULTS = {
  hideStack: false,
  snakeSize: 4
}

export const parseOutputsOption = (lines: string[]) => lines.map(parseEntry);

export const parseEntry = (entry: string) => {
  const m = entry.trim().match(/^(.+\.(svg|gif))(\?(.*)|\s*({.*}))?$/);

  if (!m) return null;

  const [, filename, format, _, q1, q2] = m;

  const query = q1 ?? q2;

  let sp = new URLSearchParams(query || "");

  try {
    const o = JSON.parse(query);

    if (Array.isArray(o.color_dots)) o.color_dots = o.color_dots.join(",");
    if (Array.isArray(o.dark_color_dots))
      o.dark_color_dots = o.dark_color_dots.join(",");

    sp = new URLSearchParams(o);
  } catch (err) {
    if (!(err instanceof SyntaxError)) throw err;
  }

  let hideStack = DEFAULTS.hideStack

  if (sp.has("hide_stack")) {
    hideStack = sp.get("hide_stack") === "true"
  }

  let snakeSize = DEFAULTS.snakeSize

  if (sp.has("snake_size")) {
    try {
      const paramsSnakeSize = Number(sp.get("snake_size"))

      if (Number.isNaN(paramsSnakeSize)) {
        throw new Error("Invalid snake_size provided, snake_size must be a number");
      }

      if(!Number.isInteger(paramsSnakeSize)){
        throw new Error("Invalid snake_size provided, snake_size must be an integer");
      }

      if(paramsSnakeSize <= 0 || paramsSnakeSize > 9){
        throw new Error("Invalid snake_size provided, snake_size must be between 1 and 9");
      }

      snakeSize = paramsSnakeSize
    } catch (error) {
      console.warn(error)
    }
  }

  const drawOptions: DrawOptions = {
    sizeDotBorderRadius: 2,
    sizeCell: 16,
    sizeDot: 12,
    ...palettes["default"],
    dark: palettes["default"].dark && { ...palettes["default"].dark },
    hideStack
  };
  const animationOptions: AnimationOptions = { step: 1, frameDuration: 100 };

  {
    const palette = palettes[sp.get("palette")!];
    if (palette) {
      Object.assign(drawOptions, palette);
      drawOptions.dark = palette.dark && { ...palette.dark };
    }
  }

  {
    const dark_palette = palettes[sp.get("dark_palette")!];
    if (dark_palette) {
      const clone = { ...dark_palette, dark: undefined };
      drawOptions.dark = clone;
    }
  }

  if (sp.has("color_snake")) drawOptions.colorSnake = sp.get("color_snake")!;
  if (sp.has("color_dots")) {
    const colors = sp.get("color_dots")!.split(/[,;]/);
    drawOptions.colorDots = colors;
    drawOptions.colorEmpty = colors[0];
    drawOptions.dark = undefined;
  }
  if (sp.has("color_dot_border"))
    drawOptions.colorDotBorder = sp.get("color_dot_border")!;

  if (sp.has("dark_color_dots")) {
    const colors = sp.get("dark_color_dots")!.split(/[,;]/);
    drawOptions.dark = {
      colorDotBorder: drawOptions.colorDotBorder,
      colorSnake: drawOptions.colorSnake,
      ...drawOptions.dark,
      colorDots: colors,
      colorEmpty: colors[0],
    };
  }
  if (sp.has("dark_color_dot_border") && drawOptions.dark)
    drawOptions.dark.colorDotBorder = sp.get("color_dot_border")!;
  if (sp.has("dark_color_snake") && drawOptions.dark)
    drawOptions.dark.colorSnake = sp.get("color_snake")!;

  return {
    filename,
    format: format as "svg" | "gif",
    drawOptions,
    animationOptions,
    snakeSize
  };
};
