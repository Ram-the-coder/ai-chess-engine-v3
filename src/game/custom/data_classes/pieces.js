import { WHITE, BLACK } from "../constants";

/** @enum {string} */
const PieceType = {
  PAWN: "p",
  KNIGHT: "n",
  BISHOP: "b",
  ROOK: "r",
  QUEEN: "q",
  KING: "k",
};

export class Piece {
  /**
   *
   * @param {WHITE | BLACK | null} color
   * @param {PieceType | null} type
   */
  constructor(color, type) {
    this.type = type;
    this.color = color;
    Object.freeze(this);
  }

  isEmpty() {
    return !this.type || !this.color;
  }

  isPawn() {
    return this.type === PieceType.PAWN;
  }

  isKnight() {
    return this.type === PieceType.KNIGHT;
  }

  isBishop() {
    return this.type === PieceType.BISHOP;
  }

  isRook() {
    return this.type === PieceType.ROOK;
  }

  isQueen() {
    return this.type === PieceType.QUEEN;
  }

  isKing() {
    return this.type === PieceType.KING;
  }
}

export const WhitePawn = new Piece(WHITE, PieceType.PAWN);
export const WhiteBishop = new Piece(WHITE, PieceType.BISHOP);
export const WhiteKnight = new Piece(WHITE, PieceType.KNIGHT);
export const WhiteRook = new Piece(WHITE, PieceType.ROOK);
export const WhiteQueen = new Piece(WHITE, PieceType.QUEEN);
export const WhiteKing = new Piece(WHITE, PieceType.KING);

export const BlackPawn = new Piece(BLACK, PieceType.PAWN);
export const BlackBishop = new Piece(BLACK, PieceType.BISHOP);
export const BlackKnight = new Piece(BLACK, PieceType.KNIGHT);
export const BlackRook = new Piece(BLACK, PieceType.ROOK);
export const BlackQueen = new Piece(BLACK, PieceType.QUEEN);
export const BlackKing = new Piece(BLACK, PieceType.KING);

export const EmptySquare = new Piece(null, null);
