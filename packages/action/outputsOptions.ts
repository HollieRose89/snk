import type { AnimationOptions } from "@snk/gif-creator";
import type { DrawOptions } from "@snk/svg-creator";
import { palettes } from "./palettes";

const DEFAULTS = {
  hideStack: false,
  snakeSize: 4,
};

const SPEEDS = {
  slow: 200,
  normal: 150,
  fast: 100,
};

export const parseOutputsOption = (lines: string[]) => lines.map(parseEntry);

export const parseEntry = (entry: string) => {
  const m = entry.trim().match(/^(.+\.(svg|gif))(\?(.*)|\s*({.*}))?$/);

  if (!m) return null;

  const [, filename, format, _, q1, q2] = m;

  const query = q1 ?? q2;

  const searchParams = parseQuery(query);
  const hideStack = parseHideStack(searchParams);
  const snakeSize = parseSnakeSize(searchParams);
  const colors = parseColors(searchParams);

  const drawOptions: DrawOptions = {
    sizeDotBorderRadius: 2,
    sizeCell: 16,
    sizeDot: 12,
    hideStack,
    ...colors,
  };

  const animationOptions: AnimationOptions = {
    step: 1,
    frameDuration: parseSpeed(searchParams),
  };

  return {
    filename,
    format: format as "svg" | "gif",
    drawOptions,
    animationOptions,
    snakeSize,
  };
};

function parseSpeed(searchParams: URLSearchParams) {
  if (searchParams.has("speed")) {
    const speed = searchParams.get("speed")!;

    if (speed in SPEEDS) {
      return SPEEDS[speed as keyof typeof SPEEDS];
    }

    console.warn(`Speed '${speed}' is not a valid speed.`);
    console.warn("Using default speed...");
  }

  return SPEEDS.normal;
}

function parseQuery(query: string) {
  let searchParams = new URLSearchParams(query || "");

  try {
    const o = JSON.parse(query);

    if (Array.isArray(o.color_dots)) {
      o.color_dots = o.color_dots.join(",");
    }

    if (Array.isArray(o.dark_color_dots)) {
      o.dark_color_dots = o.dark_color_dots.join(",");
    }

    searchParams = new URLSearchParams(o);
  } catch (err) {
    if (!(err instanceof SyntaxError)) throw err;
  }

  return searchParams;
}

function parseHideStack(searchParams: URLSearchParams) {
  if (searchParams.has("hide_stack")) {
    return searchParams.get("hide_stack") === "true";
  }

  return DEFAULTS.hideStack;
}

function parseSnakeSize(searchParams: URLSearchParams) {
  if (searchParams.has("snake_size")) {
    try {
      const paramsSnakeSize = Number(searchParams.get("snake_size"));

      if (Number.isNaN(paramsSnakeSize)) {
        throw new Error(
          "Invalid snake_size provided, snake_size must be a number"
        );
      }

      if (!Number.isInteger(paramsSnakeSize)) {
        throw new Error(
          "Invalid snake_size provided, snake_size must be an integer"
        );
      }

      if (paramsSnakeSize <= 0 || paramsSnakeSize > 9) {
        throw new Error(
          "Invalid snake_size provided, snake_size must be between 1 and 9"
        );
      }

      return paramsSnakeSize;
    } catch (error) {
      console.warn(error);
      console.warn("Using default snake size...");
    }
  }

  return DEFAULTS.snakeSize;
}

function parseColors(searchParams: URLSearchParams) {
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
