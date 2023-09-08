import { Chess } from "chess.js";
import Board from "./board.js";

export default class ChessGame {
  constructor() {
    this._chess = new Chess();
  }

  get isWhitesTurn() {
    return this._chess.turn() == "w";
  }

  get isBlacksTurn() {
    return this._chess.turn() == "b";
  }

  /**
   *
   * @returns {string} fen
   */
  getFen() {
    return this._chess.fen();
  }

  getBoard() {
    return new Board(this._chess.fen());
  }

  /**
   *
   * @param {string} moveStr
   */
  move(moveStr) {
    return this._chess.move(moveStr);
  }
}
