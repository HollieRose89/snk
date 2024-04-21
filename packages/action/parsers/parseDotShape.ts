const SHAPES = {
  square: {
    sizeDot: 12,
    sizeDotBorderRadius: 0,
  },
  "square-rounded": {
    sizeDot: 12,
    sizeDotBorderRadius: 2,
  },
  circle: {
    sizeDot: 13,
    sizeDotBorderRadius: Math.floor(13 / 2),
  },
};

export function parseDotShape(searchParams: URLSearchParams) {
  try {
    if (searchParams.has("dot_shape")) {
      const shape = searchParams.get("dot_shape")!;

      if (!(shape in SHAPES)) {
        throw new Error(`Shape '${shape}' is not a valid option.`);
      }

      return SHAPES[shape as keyof typeof SHAPES];
    }
  } catch (error) {
    console.warn(error);
    console.warn("Using default shape: 'square-rounded'");
  }

  return SHAPES["square-rounded"];
}
