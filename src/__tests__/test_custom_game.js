import Board from "../game/custom/board";
import { Move } from "../game/custom/data_classes/move";
import {
  BlackBishop,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
} from "../game/custom/data_classes/pieces";
import { generateLegalMovesForPawn } from "../game/custom/move_generation";

describe("custom board", () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  test("get turn", () => {
    expect(board.isWhitesTurn).toBe(true);
    expect(board.isBlacksTurn).toBe(false);
  });

  test("starting position", () => {
    const expectedPositionPieceMap = {
      a1: WhiteRook,
      b1: WhiteKnight,
      c1: WhiteBishop,
      d1: WhiteQueen,
      e1: WhiteKing,
      f1: WhiteBishop,
      g1: WhiteKnight,
      h1: WhiteRook,

      a2: WhitePawn,
      b2: WhitePawn,
      c2: WhitePawn,
      d2: WhitePawn,
      e2: WhitePawn,
      f2: WhitePawn,
      g2: WhitePawn,
      h2: WhitePawn,

      a8: BlackRook,
      b8: BlackKnight,
      c8: BlackBishop,
      d8: BlackQueen,
      e8: BlackKing,
      f8: BlackBishop,
      g8: BlackKnight,
      h8: BlackRook,

      a7: BlackPawn,
      b7: BlackPawn,
      c7: BlackPawn,
      d7: BlackPawn,
      e7: BlackPawn,
      f7: BlackPawn,
      g7: BlackPawn,
      h7: BlackPawn,
    };

    for (const square in expectedPositionPieceMap) {
      expect(board.getPieceAtSan(square)).toBe(
        expectedPositionPieceMap[square]
      );
    }
  });
});

describe("move generation", () => {
  test("can generate pawn moves", () => {
    const board = new Board({ init: false });
    board.setPiece({ piece: WhitePawn, square: "e2" });
    board.setPiece({ piece: BlackPawn, square: "d3" });
    board.setPiece({ piece: BlackPawn, square: "f3" });

    const legalMoves = generateLegalMovesForPawn(board, "e2", WhitePawn);
    expect(legalMoves).toEqual([
      new Move("e2", "e3"),
      new Move("e2", "e4"),
      new Move("e2", "d3"),
      new Move("e2", "f3"),
    ]);
  });
  test.skip("can generate enpassant move", () => {});
});
