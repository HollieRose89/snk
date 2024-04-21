const DEFAULT_HIDE_STACK = false;

export function parseHideStack(searchParams: URLSearchParams) {
  if (searchParams.has("hide_stack")) {
    return searchParams.get("hide_stack") === "true";
  }

  return DEFAULT_HIDE_STACK;
}
