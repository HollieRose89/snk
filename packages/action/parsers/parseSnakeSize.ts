const DEFAULT_SNAKE_SIZE = 4;
const MIN_SIZE = 1;
const MAX_SIZE = 6;

export function parseSnakeSize(searchParams: URLSearchParams) {
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

      if (paramsSnakeSize < MIN_SIZE || paramsSnakeSize > MAX_SIZE) {
        throw new Error(
          `Invalid snake_size provided, snake_size must be between ${MIN_SIZE} and ${MAX_SIZE}`
        );
      }

      return paramsSnakeSize;
    } catch (error) {
      console.warn(error);
      console.warn("Using default snake size...");
    }
  }

  return DEFAULT_SNAKE_SIZE;
}
