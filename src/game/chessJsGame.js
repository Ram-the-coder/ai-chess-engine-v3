import { Chess } from "chess.js";
import { PIECE_POINTS_BY_SQUARE, PIECE_POINT_MAP } from "../board.js";

export default class ChessJsGame {
  constructor() {
    this._chess = new Chess();

    /**
     * Assert that ChessJsGame correctly implements Game
     * @type { import("./type.js").Game }
     * */
    const instance = this;
  }

  get isWhitesTurn() {
    return this._chess.turn() == "w";
  }

  get isBlacksTurn() {
    return this._chess.turn() == "b";
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

  /** @returns {number} score */
  getScore() {
    let score = 0;
    this._chess.board().forEach((row) =>
      row.filter(Boolean).forEach((piece) => {
        // @ts-ignore
        const { type, color, square } = piece;
        const column = square[0].charCodeAt(0) - "a".charCodeAt(0);
        const row = 8 - square[1];
        const absVal =
          PIECE_POINT_MAP[type] +
          PIECE_POINTS_BY_SQUARE[type][color][row][column];
        score += color === "w" ? absVal : -absVal;
      })
    );
    return score;
  }

  getAvailableMoves() {
    return this._chess.moves();
  }

  undo() {
    return this._chess.undo();
  }

  /**
   *
   * @returns {string} fen
   */
  getFen() {
    return this._chess.fen();
  }

  /**
   *
   * @param {string} moveStr
   */
  move(moveStr) {
    return this._chess.move(moveStr);
  }
}
