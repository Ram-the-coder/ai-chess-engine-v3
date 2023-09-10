import Board, {
  allSquaresSan,
  sanToCoordinates,
  coordinatesToSan,
} from "../board.js";
import { Move } from "../data_classes/move.js";
import { Piece } from "../data_classes/pieces.js";
import { InvalidCoordsError } from "../errors.js";

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
 * @returns {Move[]}
 */
export function generateLegalMovesForPawn(board, square) {
  const piece = board.getPieceAtSan(square);
  if (!piece.isPawn())
    throw new Error(`no pawn at square ${square}. found piece ${piece.type}`);
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
    const jumpSquareCoords = board.isWhitesTurn ? [i - 1, j] : [i + 1, j];
    const targetSquareCoords = board.isWhitesTurn ? [i - 2, j] : [i + 2, j];
    if (
      board.getPieceAtCoords(jumpSquareCoords).isEmpty() &&
      board.getPieceAtCoords(targetSquareCoords).isEmpty()
    )
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

/**
 *
 * @param {Board} board
 * @param {string} square
 * @returns {Move[]}
 */
export function generateLegalMovesForKnight(board, square) {
  const piece = board.getPieceAtSan(square);
  if (!piece.isKnight())
    throw new Error(`no knight at square ${square}. found piece ${piece.type}`);
  const result = [];
  if (board.turn !== piece.color) return result;
  const [i, j] = sanToCoordinates(square);
  const targetCoordinates = [
    [i - 2, j + 1],
    [i - 1, j + 2],
    [i + 1, j + 2],
    [i + 2, j + 1],
    [i + 2, j - 1],
    [i + 1, j - 2],
    [i - 1, j - 2],
    [i - 2, j - 1],
  ];
  targetCoordinates
    .filter((targetCoord) => filterOutInvalidCoordinates(board, targetCoord))
    .filter((targetCoord) =>
      filterOutCoordsBlockedByAllyPiece(board, targetCoord)
    )
    .forEach((targetCoord) => {
      result.push(new Move(square, coordinatesToSan(targetCoord)));
    });
  return result;
}

/**
 * @param {Board} board
 * @param {number[]} targetCoord
 * @returns {boolean}
 */
function filterOutInvalidCoordinates(board, targetCoord) {
  try {
    board.getPieceAtCoords(targetCoord);
    return true;
  } catch (e) {
    if (!(e instanceof InvalidCoordsError)) throw e;
    return false;
  }
}

/**
 * @param {Board} board
 * @param {number[]} targetCoord
 * @returns {boolean}
 */
function filterOutCoordsBlockedByAllyPiece(board, targetCoord) {
  const piece = board.getPieceAtCoords(targetCoord);
  return piece.isEmpty() || piece.color !== board.turn;
}

/**
 *
 * @param {Board} board
 * @param {string} square
 */
export function generateLegalMovesForBishop(board, square) {
  const piece = board.getPieceAtSan(square);
  if (!piece.isBishop())
    throw new Error(`no bishop at square ${square}. found piece ${piece.type}`);
  return getLegalDiagonalMoves(board, square, piece);
}

/**
 *
 * @param {Board} board
 * @param {string} square
 * @param {Piece} piece
 * @param {number[][]} diffs
 * @returns
 */
function getLegalMovesByIterativeDiff(square, board, piece, diffs) {
  const result = [];
  const targetCoordinates = [];
  const [i, j] = sanToCoordinates(square);

  diffs.forEach(([iDiff, jDiff]) => {
    for (
      let m = i + iDiff, n = j + jDiff;
      m >= 0 && n >= 0 && m <= 7 && n <= 7;
      m += iDiff, n += jDiff
    ) {
      const targetPiece = board.getPieceAtCoords([m, n]);
      if (targetPiece.isEmpty()) targetCoordinates.push([m, n]);
      else {
        if (targetPiece.color !== piece.color) targetCoordinates.push([m, n]);
        break;
      }
    }
  });

  targetCoordinates.forEach((targetCoord) => {
    result.push(new Move(square, coordinatesToSan(targetCoord)));
  });

  return result;
}

/**
 *
 * @param {Board} board
 * @param {string} square
 * @param {Piece} piece
 * @returns
 */
function getLegalStraightMoves(board, square, piece) {
  const diffs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  return getLegalMovesByIterativeDiff(square, board, piece, diffs);
}

/**
 *
 * @param {Board} board
 * @param {string} square
 * @param {Piece} piece
 * @returns
 */
function getLegalDiagonalMoves(board, square, piece) {
  const diffs = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];
  return getLegalMovesByIterativeDiff(square, board, piece, diffs);
}

/**
 * @param {Board} board
 * @param {string} square
 * @returns {Move[]}
 */
export function generateLegalMovesForRook(board, square) {
  const piece = board.getPieceAtSan(square);
  if (!piece.isRook())
    throw new Error(`no rook at square ${square}. found piece ${piece.type}`);
  return getLegalStraightMoves(board, square, piece);
}

/**
 * @param {Board} board
 * @param {string} square
 * @returns {Move[]}
 */
export function generateLegalMovesForQueen(board, square) {
  const piece = board.getPieceAtSan(square);
  if (!piece.isQueen())
    throw new Error(`no queen at square ${square}. found piece ${piece.type}`);
  const legalStraightMoves = getLegalStraightMoves(board, square, piece);
  const legalDiagonalMoves = getLegalDiagonalMoves(board, square, piece);
  return legalStraightMoves.concat(legalDiagonalMoves);
}

/**
 * @param {Board} board
 * @param {string} square
 * @returns {Move[]}
 */
export function generateLegalMovesForKing(board, square) {
  const piece = board.getPieceAtSan(square);
  if (!piece.isKing())
    throw new Error(`no king at square ${square}. found piece ${piece.type}`);

  const result = [];
  const [i, j] = sanToCoordinates(square);
  const targetCoordinates = [
    [i - 1, j - 1],
    [i - 1, j],
    [i - 1, j + 1],
    [i, j - 1],
    [i, j + 1],
    [i + 1, j - 1],
    [i + 1, j],
    [i + 1, j + 1],
  ];
  targetCoordinates
    .filter((targetCoord) => filterOutInvalidCoordinates(board, targetCoord))
    .filter((targetCoord) =>
      filterOutCoordsBlockedByAllyPiece(board, targetCoord)
    )
    .forEach((targetCoord) => {
      result.push(new Move(square, coordinatesToSan(targetCoord)));
    });
  return result;
}
