import { createSnakeFromCells } from "../snake";

export const createSnakeFromSize = (length: number) => {
    return createSnakeFromCells(
        Array.from({ length }, (_, i) => ({ x: i, y: -1 }))
    );
}