const SPEEDS = {
  slow: 200,
  normal: 150,
  fast: 100,
};

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
