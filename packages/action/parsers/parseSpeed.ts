import { Cell } from "@snk/github-user-contribution";

export const SPEEDS = {
  slow: 200,
  normal: 150,
  fast: 100,
  auto: "auto",
} as const;

export function parseSpeed(searchParams: URLSearchParams) {
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

export function calculateAutoSpeed(cells: Cell[]) {
  const void_cells = cells.reduce((prev, current) => {
    if (current.level === 0) {
      prev++;
    }

    return prev;
  }, 0);

  if (void_cells >= cells.length * (2 / 3)) {
    return SPEEDS.slow;
  }

  if (void_cells >= cells.length * (1 / 3)) {
    return SPEEDS.normal;
  }

  return SPEEDS.fast;
}
