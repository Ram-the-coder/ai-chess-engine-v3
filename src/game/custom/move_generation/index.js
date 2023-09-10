import Board, {
  allSquaresSan,
  sanToCoordinates,
  coordinatesToSan,
} from "../board.js";
import { Move } from "../data_classes/move.js";
import { Piece } from "../data_classes/pieces.js";

/**
 * @param {Board} board
 * @returns {Move[]}
 */
function generateLegalMoves(board) {
  const result = [];
  for (const square of allSquaresSan) {
    const piece = board.getPieceAtSan(square);
    result.push(...generateLegalMovesForPawn(board, square, piece));
  }
  return result;
}

/**
 *
 * @param {Board} board
 * @param {string} square
 * @param {Piece} piece
 * @returns {Move[]}
 */
export function generateLegalMovesForPawn(board, square, piece) {
  const result = [];
  if (board.turn !== piece.color) return result;
  const [i, j] = sanToCoordinates(square);
  // Check one square
  try {
    const targetSquareCoords = board.isWhitesTurn ? [i - 1, j] : [i + 1, j];
    if (board.getPieceAtCoords(targetSquareCoords).isEmpty())
      result.push(new Move(square, coordinatesToSan(targetSquareCoords)));
  } catch (e) {}

  // Check two squares
  try {
    const targetSquareCoords = board.isWhitesTurn ? [i - 2, j] : [i + 2, j];
    if (board.getPieceAtCoords(targetSquareCoords).isEmpty())
      result.push(new Move(square, coordinatesToSan(targetSquareCoords)));
  } catch {}

  // Check attacks
  const targetCoordinates = board.isWhitesTurn
    ? [
        [i - 1, j - 1],
        [i - 1, j + 1],
      ]
    : [
        [i + 1, j - 1],
        [i + 1, j + 1],
      ];
  targetCoordinates
    .map(([targetI, targetJ]) => {
      try {
        return coordinatesToSan([targetI, targetJ]);
      } catch {
        return null;
      }
    })
    .filter((targetSquare) => {
      if (!targetSquare) return false;
      const attackedPiece = board.getPieceAtSan(targetSquare);
      return (
        attackedPiece &&
        !attackedPiece.isEmpty() &&
        attackedPiece.color !== piece.color
      );
    })
    // @ts-ignore
    .forEach((targetSquare) => result.push(new Move(square, targetSquare)));

  // Check enpassant
  return result;
}
