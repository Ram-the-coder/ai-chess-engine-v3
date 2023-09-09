import v8Profiler from "v8-profiler-next";
import fs from "fs";
import ChessGame from "../game.js";
import Stats from "../stats.js";

export default class Engine {
  /**
   *
   * @param {ChessGame} chessGame
   */
  constructor(chessGame) {
    this.chessGame = chessGame;
  }

  getRecommendedMove(depth = 2) {
    const title = "myprofile";
    v8Profiler.setGenerateType(1);
    v8Profiler.startProfiling(title, true);
    Stats.timer.start("getRecommendedMove");
    const { move, score } = minMax({
      game: this.chessGame,
      depth,
    });
    Stats.timer.end("getRecommendedMove");
    const nodesCount = Stats.counter.getCount("minMax");
    const timeTaken = Stats.timer.getAverageTimerDuration("getRecommendedMove");
    console.log(`nodes visited: ${nodesCount}`);
    console.log(`time taken: ${timeTaken}`);
    console.log(`timer per node: ${(timeTaken / nodesCount).toPrecision(3)}`);
    Stats.reset();
    const profile = v8Profiler.stopProfiling(title);
    profile.export(function (error, result) {
      // if it doesn't have the extension .cpuprofile then
      // chrome's profiler tool won't like it.
      // examine the profile:
      //   Navigate to chrome://inspect
      //   Click Open dedicated DevTools for Node
      //   Select the profiler tab
      //   Load your file
      fs.writeFileSync(`${title}.cpuprofile`, result);
      profile.delete();
    });
    return move;
  }
}

/**
 * @typedef {Object} Recommendation
 * @property {number} score
 * @property {string} [move]
 *
 * @param {Object} props
 * @param {ChessGame} props.game
 * @param {number} props.depth
 * @param {boolean} [props.shouldMaximize]
 * @param {number} [props.alpha]
 * @param {number} [props.beta]
 * @returns {Recommendation} recommendation
 */
function minMax({
  game,
  depth,
  shouldMaximize = true,
  alpha = -Infinity,
  beta = Infinity,
}) {
  Stats.counter.incr("minMax");

  // Terminal Node Case
  if (game.isGameOver()) {
    if (game.isDraw()) return { score: 0 };
    return game.isWhiteWinner() ? { score: Infinity } : { score: -Infinity };
  }
  if (depth === 0) return { score: game.getScore() };

  // Non-Terminal Node Case
  let currentAlpha = alpha;
  let currentBeta = beta;
  let bestScore = shouldMaximize ? -Infinity : Infinity;
  let bestMove = undefined;

  game.getAvailableMoves().forEach(handleMove);
  return { score: bestScore, move: bestMove };

  function handleMove(move) {
    if (alpha >= beta) return;
    game.move(move);
    // const boardAfterMove = board.getBoardAfterMove(move);
    const { score: boardScoreAfterMove } = minMax({
      game,
      depth: depth - 1,
      shouldMaximize: !shouldMaximize,
      alpha: currentAlpha,
      beta: currentBeta,
    });
    game.undo();

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
  }
}
