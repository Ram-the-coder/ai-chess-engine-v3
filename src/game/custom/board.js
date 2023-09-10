import _ from "lodash";
import { BLACK, WHITE } from "./constants";
import {
  BlackBishop,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  EmptySquare,
  Piece,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
} from "./data_classes/pieces";
const { get, set } = _;

class InvalidCoordsError extends Error {}
class InvalidSanError extends Error {}

const sanToCoordinateMap = {};
const coordinatesToSanMap = {};
const charCodeOfLowerCaseA = "a".charCodeAt(0);
for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    const san = String.fromCharCode(charCodeOfLowerCaseA + j) + String(8 - i);
    sanToCoordinateMap[san] = [i, j];
    set(coordinatesToSanMap, [i, j], san);
  }
}

/**
 *
 * @param {string} san
 * @returns {number[]} [i, j]
 */
export const sanToCoordinates = (san) => {
  const coords = sanToCoordinateMap[san];
  if (!coords) throw new InvalidSanError(san);
  return coords;
};

/**
 * @param {number[]} coords
 * @returns {string}
 */
export const coordinatesToSan = ([i, j]) => {
  if (i >= 8 || i < 0 || j >= 8 || j < 0)
    throw new InvalidCoordsError(`${i}, ${j}`);
  return coordinatesToSanMap[i][j];
};

export const allSquaresSan = Object.keys(sanToCoordinateMap);

function getNaiveBoardRepresentation() {
  const board = [];
  for (let i = 0; i < 8; i++) {
    const row = [];
    for (let j = 0; j < 8; j++) {
      row.push(EmptySquare);
    }
    board.push(row);
  }
  return board;
}

function initBoard(board) {
  const initialPositionPieceMap = {
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

  for (const square in initialPositionPieceMap) {
    board.setPiece({ piece: initialPositionPieceMap[square], square });
  }
}

export default class Board {
  constructor(options = { init: true }) {
    const { init } = options;
    this._board = getNaiveBoardRepresentation();
    if (init) initBoard(this);
    this.turn = WHITE;

    /** @type {import("../type").Game} */
    const instance = this;
  }

  /**
   * @param {string} squareSan
   * @throws {InvalidCoordsError}
   * @returns {Piece} piece
   * */
  getPieceAtSan(squareSan) {
    const coords = sanToCoordinates(squareSan);
    return this.getPieceAtCoords(coords);
  }

  /**
   *
   * @param {number[]} coords
   * @returns {Piece} piece
   */
  getPieceAtCoords([i, j]) {
    const piece = get(this._board, [i, j]);
    if (!piece) throw new InvalidCoordsError();
    return piece;
  }

  setPiece({ piece, square }) {
    const [i, j] = sanToCoordinates(square);
    this._board[i][j] = piece;
  }

  get isWhitesTurn() {
    return this.turn == WHITE;
  }

  get isBlacksTurn() {
    return this.turn == BLACK;
  }
}
