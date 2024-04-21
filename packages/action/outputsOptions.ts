import type { AnimationOptions } from "@snk/gif-creator";
import type { DrawOptions } from "@snk/svg-creator";
import {
  parseColors,
  parseQuery,
  parseSnakeSize,
  parseSpeed,
  parseDotShape,
  parseHideStack,
} from "./parsers";

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
  const shape = parseDotShape(searchParams);

  const drawOptions: DrawOptions = {
    sizeCell: 16,
    hideStack,
    ...colors,
    ...shape,
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
