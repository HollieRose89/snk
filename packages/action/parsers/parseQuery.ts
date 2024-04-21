export function parseQuery(query: string) {
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
