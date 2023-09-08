import { Chess } from "chess.js";
import Stats from "./stats.js";

const PIECE_POINT_MAP = {
  k: 0,
  q: 9,
  p: 1,
  n: 3,
  b: 3,
  r: 5,
};
const PIECE_POINTS_BY_SQUARE = { p: {}, n: {}, b: {}, r: {}, k: {}, q: {} };
PIECE_POINTS_BY_SQUARE["p"]["w"] = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
  [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
  [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
  [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
  [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
  [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
];

PIECE_POINTS_BY_SQUARE["p"]["b"] = PIECE_POINTS_BY_SQUARE["p"]["w"]
  .slice()
  .reverse();

PIECE_POINTS_BY_SQUARE["n"]["w"] = [
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
  [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
  [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
  [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
  [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
  [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
];
PIECE_POINTS_BY_SQUARE["n"]["b"] = PIECE_POINTS_BY_SQUARE["n"]["w"];

PIECE_POINTS_BY_SQUARE["b"]["w"] = [
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
  [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
  [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
  [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
  [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
];

PIECE_POINTS_BY_SQUARE["b"]["b"] = PIECE_POINTS_BY_SQUARE["b"]["w"]
  .slice()
  .reverse();

PIECE_POINTS_BY_SQUARE["r"]["w"] = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
];

PIECE_POINTS_BY_SQUARE["r"]["b"] = PIECE_POINTS_BY_SQUARE["r"]["w"]
  .slice()
  .reverse();

PIECE_POINTS_BY_SQUARE["q"]["w"] = [
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
];
PIECE_POINTS_BY_SQUARE["q"]["b"] = PIECE_POINTS_BY_SQUARE["q"]["w"];

PIECE_POINTS_BY_SQUARE["k"]["w"] = [
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
  [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
  [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
  [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0],
];
PIECE_POINTS_BY_SQUARE["k"]["b"] = PIECE_POINTS_BY_SQUARE["k"]["w"]
  .slice()
  .reverse();

/**
 * @typedef {Object|null} TwoDSquare
 * @property {string} square
 * @property {string} type
 * @property {string} color
 *
 * @typedef {TwoDSquare[][]} TwoDRepresentation
 */

export default class Board {
  /**
   * @param {string} fen
   */
  constructor(fen) {
    this._chess = new Chess(fen);
  }

  isGameOver() {
    return this._chess.isGameOver();
  }

  isDraw() {
    return this._chess.isDraw();
  }

  isWhiteWinner() {
    return this.isGameOver() && !this.isDraw() && this._chess.turn() == "b";
  }

  isBlackWinner() {
    return this.isGameOver() && !this.isDraw() && !this.isWhiteWinner();
  }

  getFen() {
    return this._chess.fen();
  }

  /**
   * @returns {number} score
   */
  getScore() {
    let score = 0;
    this._chess.board().forEach((row) =>
      row.filter(Boolean).forEach((piece) => {
        // @ts-ignore
        const { type, color, square } = piece;
        const column = square[0].charCodeAt(0) - "a".charCodeAt(0);
        const row = 8 - square[1];
        score += this._getPiecePoint({ type, color }, row, column);
      })
    );
    return score;
  }

  /**
   *
   * @param {Object} piece
   * @param {string} piece.type
   * @param {'w'|'b'} piece.color
   * @param {number} row
   * @param {number} column
   */
  _getPiecePoint(piece, row, column) {
    function getAbsoluteValue({ type, color }, i, j) {
      return PIECE_POINT_MAP[type] + PIECE_POINTS_BY_SQUARE[type][color][i][j];
    }
    const absVal = getAbsoluteValue(piece, row, column);
    return piece.color === "w" ? absVal : -absVal;
  }

  /** @returns {string[]} available moves */
  getAvailableMoves() {
    return this._chess.moves();
  }

  /**
   *
   * @param {string} moveStr
   * @returns
   */
  getBoardAfterMove(moveStr) {
    Stats.counter.incr("getBoardAfterMove");
    Stats.timer.start("getBoardAfterMove");
    const new_chess = new Chess(this._chess.fen());
    new_chess.move(moveStr);
    const board = new Board(new_chess.fen());
    Stats.timer.end("getBoardAfterMove");
    return board;
  }
}
