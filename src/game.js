import { Chess } from "chess.js";

export default class ChessGame {
  constructor() {
    this.chess = new Chess();
  }

  /**
   *
   * @returns {string} fen
   */
  getFen() {
    return this.chess.fen();
  }

  /**
   *
   * @param {string} moveStr
   */
  move(moveStr) {
    this.chess.move(moveStr);
  }
}
