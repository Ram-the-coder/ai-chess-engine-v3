import Board from "../board.js";
import ChessGame from "../game.js";
import Stats from "../stats.js";

export default class Engine {
  /**
   *
   * @param {ChessGame} chessGame
   */
  constructor(chessGame) {
    this._chessGame = chessGame;
  }

  getRecommendedMove(depth = 2) {
    Stats.timer.start("getRecommendedMove");
    const { move, score } = minMax({
      board: this._chessGame.getBoard(),
      depth,
    });
    Stats.timer.end("getRecommendedMove");
    const nodesCount = Stats.counter.getCount("minMax");
    const timeTaken = Stats.timer.getAverageTimerDuration("getRecommendedMove");
    console.log(`nodes visited: ${nodesCount}`);
    console.log(`time taken: ${timeTaken}`);
    console.log(`timer per node: ${(nodesCount / timeTaken).toPrecision(3)}`);
    console.log(
      `time per boardAfterMove: ${Stats.timer.getAverageTimerDuration(
        "getBoardAfterMove"
      )}`
    );
    console.log(
      `count getBoardAfterMove: ${Stats.counter.getCount("getBoardAfterMove")}`
    );
    console.log(
      `total time getBoardAfterMove: ${
        Stats.counter.getCount("getBoardAfterMove") *
        Stats.timer.getAverageTimerDuration("getBoardAfterMove")
      }`
    );
    Stats.reset();
    return move;
  }
}

/**
 * @typedef {Object} Recommendation
 * @property {number} score
 * @property {string} [move]
 *
 * @param {Object} props
 * @param {Board} props.board
 * @param {number} props.depth
 * @param {boolean} [props.shouldMaximize]
 * @param {number} [props.alpha]
 * @param {number} [props.beta]
 * @returns {Recommendation} recommendation
 */
function minMax({
  board,
  depth,
  shouldMaximize = true,
  alpha = -Infinity,
  beta = Infinity,
}) {
  Stats.counter.incr("minMax");

  // Terminal Node Case
  if (board.isGameOver()) {
    if (board.isDraw()) return { score: 0 };
    return board.isWhiteWinner() ? { score: Infinity } : { score: -Infinity };
  }
  if (depth === 0) return { score: board.getScore() };

  // Non-Terminal Node Case
  let currentAlpha = alpha;
  let currentBeta = beta;
  let bestScore = shouldMaximize ? -Infinity : Infinity;
  let bestMove = undefined;

  board.getAvailableMoves().forEach((move) => {
    if (alpha >= beta) return;
    const boardAfterMove = board.getBoardAfterMove(move);
    const { score: boardScoreAfterMove } = minMax({
      board: boardAfterMove,
      depth: depth - 1,
      shouldMaximize: !shouldMaximize,
      alpha: currentAlpha,
      beta: currentBeta,
    });
    const updateBestData = () => {
      bestScore = boardScoreAfterMove;
      bestMove = move;
    };

    if (shouldMaximize) {
      if (boardScoreAfterMove > bestScore) {
        updateBestData();
        currentAlpha = bestScore;
      }
    } else {
      if (boardScoreAfterMove < bestScore) {
        updateBestData();
        currentBeta = bestScore;
      }
    }
  });
  return { score: bestScore, move: bestMove };
}
