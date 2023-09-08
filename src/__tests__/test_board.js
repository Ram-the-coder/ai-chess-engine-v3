import Board from "../board";

describe("Board", () => {
  const scenarios = [
    {
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      expectedScore: 0,
    },
  ];
  scenarios.forEach(({ fen, expectedScore }) =>
    test(fen, () => {
      const board = new Board(fen);
      expect(board.getScore()).toEqual(expectedScore);
    })
  );
});
