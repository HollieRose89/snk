import { getGithubUserContribution } from "@snk/github-user-contribution";
import { userContributionToGrid } from "./userContributionToGrid";
import { getBestRoute } from "@snk/solver/getBestRoute";
import { createSnakeFromSize } from "@snk/types/__fixtures__/createSnakeFromSize";
import { getPathToPose } from "@snk/solver/getPathToPose";
import type { DrawOptions as DrawOptions } from "@snk/svg-creator";
import { ParsedAnimationOptions } from "./outputsOptions";
import { calculateAutoSpeed } from "./parsers";

export const generateContributionSnake = async (
  userName: string,
  outputs: ({
    format: "svg" | "gif";
    drawOptions: DrawOptions;
    animationOptions: ParsedAnimationOptions;
    snakeSize: number;
  } | null)[],
  options: { githubToken: string }
) => {
  console.log("🎣 fetching github user contribution");
  const cells = await getGithubUserContribution(userName, options);
  const grid = userContributionToGrid(cells);

  return Promise.all(
    outputs.map(async (out, i) => {
      if (!out) return;

      const { format, drawOptions, animationOptions, snakeSize } = out;

      if (animationOptions.detectSpeed) {
        animationOptions.frameDuration = calculateAutoSpeed(cells);
      }

      const snake = createSnakeFromSize(snakeSize);

      console.log(`📡 computing best route for ${i}° snake`);
      const chain = getBestRoute(grid, snake)!;
      chain.push(...getPathToPose(chain.slice(-1)[0], snake)!);

      switch (format) {
        case "svg": {
          console.log(`🖌 creating svg (outputs[${i}])`);
          const { createSvg } = await import("@snk/svg-creator");
          return createSvg(grid, cells, chain, drawOptions, animationOptions);
        }
        case "gif": {
          console.log(`📹 creating gif (outputs[${i}])`);
          const { createGif } = await import("@snk/gif-creator");
          return await createGif(
            grid,
            cells,
            chain,
            drawOptions,
            animationOptions
          );
        }
      }
    })
  );
};
