import Board from "../game/custom/board";
import { BLACK } from "../game/custom/constants";
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
import {
  generateLegalMovesForBishop,
  generateLegalMovesForKing,
  generateLegalMovesForKnight,
  generateLegalMovesForPawn,
  generateLegalMovesForQueen,
  generateLegalMovesForRook,
} from "../game/custom/move_generation";

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
  describe("pawn moves", () => {
    test("throws error if given a square without a pawn", () => {
      const board = new Board({ init: false });
      expect(() => generateLegalMovesForPawn(board, "e2")).toThrow();
    });

    test("can generate pawn moves", () => {
      const board = new Board({ init: false });
      board.setPiece({ piece: WhitePawn, square: "e2" });
      board.setPiece({ piece: BlackPawn, square: "d3" });
      board.setPiece({ piece: BlackPawn, square: "f3" });

      const legalMoves = generateLegalMovesForPawn(board, "e2");
      expect(legalMoves).toIncludeSameMembers([
        new Move("e2", "e3"),
        new Move("e2", "e4"),
        new Move("e2", "d3"),
        new Move("e2", "f3"),
      ]);
    });

    test.skip("can generate enpassant move", () => {});

    test("all moves are blocked", () => {
      const board = new Board({ init: false });
      board.setPiece({ piece: WhitePawn, square: "e2" });
      board.setPiece({ piece: WhitePawn, square: "d3" });
      board.setPiece({ piece: WhitePawn, square: "f3" });
      board.setPiece({ piece: WhiteBishop, square: "e3" });
      const legalMoves = generateLegalMovesForPawn(board, "e2");
      expect(legalMoves).toEqual([]);
    });
  });

  describe("knight moves", () => {
    test("throws error if given a square without a knight", () => {
      const board = new Board({ init: false });
      expect(() => generateLegalMovesForKnight(board, "e2")).toThrow();
    });

    test("can generate knight moves", () => {
      const board = new Board({ init: false });
      board.setPiece({ piece: BlackKnight, square: "f3" });
      board.setPiece({ piece: WhiteBishop, square: "h2" });
      board.turn = BLACK;

      expect(generateLegalMovesForKnight(board, "f3")).toIncludeSameMembers(
        [
          new Move("f3", "h4"),
          new Move("f3", "h2"),
          new Move("f3", "g1"),
          new Move("f3", "e1"),
          new Move("f3", "d2"),
          new Move("f3", "d4"),
          new Move("f3", "e5"),
          new Move("f3", "g5"),
        ].sort()
      );
    });

    test("all moves blocked by own piece", () => {
      const board = new Board({ init: false });
      board.setPiece({ piece: WhiteKnight, square: "a1" });
      board.setPiece({ piece: WhiteKing, square: "b3" });
      board.setPiece({ piece: WhiteQueen, square: "c2" });

      expect(generateLegalMovesForKnight(board, "a1")).toEqual([]);
    });
  });

  describe("bishop moves", () => {
    test("throws error if given a square without a bishop", () => {
      const board = new Board({ init: false });
      expect(() => generateLegalMovesForBishop(board, "e2")).toThrow();
    });

    test("gets all moves", () => {
      const board = new Board({ init: false });
      board.setPiece({ piece: WhiteBishop, square: "e4" });
      board.setPiece({ piece: WhiteRook, square: "c6" });
      board.setPiece({ piece: BlackPawn, square: "c2" });

      expect(generateLegalMovesForBishop(board, "e4")).toIncludeSameMembers([
        new Move("e4", "d5"),
        new Move("e4", "f5"),
        new Move("e4", "g6"),
        new Move("e4", "h7"),
        new Move("e4", "f3"),
        new Move("e4", "g2"),
        new Move("e4", "h1"),
        new Move("e4", "d3"),
        new Move("e4", "c2"),
      ]);
    });
  });

  describe("rook moves", () => {
    test("throws error if given a square without a rook", () => {
      const board = new Board({ init: false });
      expect(() => generateLegalMovesForRook(board, "e2")).toThrow();
    });

    test("gets all moves", () => {
      const board = new Board({ init: false });
      board.setPiece({ piece: BlackRook, square: "c3" });
      board.setPiece({ piece: WhiteKnight, square: "c7" });
      board.setPiece({ piece: BlackPawn, square: "f3" });
      board.turn = BLACK;

      expect(generateLegalMovesForRook(board, "c3")).toIncludeSameMembers([
        new Move("c3", "c4"),
        new Move("c3", "c5"),
        new Move("c3", "c6"),
        new Move("c3", "c7"),
        new Move("c3", "d3"),
        new Move("c3", "e3"),
        new Move("c3", "c2"),
        new Move("c3", "c1"),
        new Move("c3", "b3"),
        new Move("c3", "a3"),
      ]);
    });
  });

  describe("queen moves", () => {
    test("throws error if given a square without a queen", () => {
      const board = new Board({ init: false });
      expect(() => generateLegalMovesForRook(board, "e2")).toThrow();
    });

    test("gets all moves", () => {
      const board = new Board({ init: false });
      board.setPiece({ piece: WhiteQueen, square: "e5" });
      board.setPiece({ piece: WhiteKing, square: "g7" });
      board.setPiece({ piece: WhitePawn, square: "a5" });
      board.setPiece({ piece: BlackRook, square: "b2" });
      board.setPiece({ piece: BlackKnight, square: "g3" });

      expect(generateLegalMovesForQueen(board, "e5")).toIncludeSameMembers([
        new Move("e5", "e1"),
        new Move("e5", "e2"),
        new Move("e5", "e3"),
        new Move("e5", "e4"),
        new Move("e5", "e6"),
        new Move("e5", "e7"),
        new Move("e5", "e8"),
        new Move("e5", "b5"),
        new Move("e5", "c5"),
        new Move("e5", "d5"),
        new Move("e5", "f5"),
        new Move("e5", "g5"),
        new Move("e5", "h5"),
        new Move("e5", "b2"),
        new Move("e5", "c3"),
        new Move("e5", "d4"),
        new Move("e5", "f6"),
        new Move("e5", "b8"),
        new Move("e5", "c7"),
        new Move("e5", "d6"),
        new Move("e5", "f4"),
        new Move("e5", "g3"),
      ]);
    });
  });

  describe("king moves", () => {
    test("throws error if given a square without a king", () => {
      const board = new Board({ init: false });
      expect(() => generateLegalMovesForRook(board, "e2")).toThrow();
    });

    test("return all moves", () => {
      const board = new Board({ init: false });
      board.setPiece({ piece: WhiteKing, square: "e1" });
      board.setPiece({ piece: WhiteRook, square: "d1" });
      board.setPiece({ piece: BlackPawn, square: "f2" });

      expect(generateLegalMovesForKing(board, "e1")).toIncludeSameMembers([
        new Move("e1", "d2"),
        new Move("e1", "e2"),
        new Move("e1", "f2"),
        new Move("e1", "f1"),
      ]);
    });
  });
});
