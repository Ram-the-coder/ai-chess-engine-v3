import Game from "../game";

describe("Chess Game", () => {
  test("creates a new chess game", () => {
    const chessGame = new Game();
    expect(chessGame.isWhitesTurn).toBe(true);
    expect(chessGame.isBlacksTurn).toBe(false);
    expect(chessGame.getFen()).toEqual(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    );
  });

  test("can make a move as white", () => {
    const chessGame = new Game();
    chessGame.move("e4");
    expect(chessGame.getFen()).toEqual(
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
    );
    expect(chessGame.isWhitesTurn).toBe(false);
    expect(chessGame.isBlacksTurn).toBe(true);
  });
  test("can make move as black", () => {
    const chessGame = new Game();
    chessGame.move("e4");
    chessGame.move("e5");
    expect(chessGame.getFen()).toEqual(
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"
    );
    expect(chessGame.isWhitesTurn).toBe(true);
    expect(chessGame.isBlacksTurn).toBe(false);
  });
});

describe("Scoring", () => {
  test("starting position is equal", () => {
    const game = new Game();
    expect(game.getScore()).toEqual(0);
  });
});
