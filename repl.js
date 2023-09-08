let { default: Engine } = await import("./src/ai/engine.js");
let { default: ChessGame } = await import("./src/game.js");
let { default: Stats } = await import("./src/stats.js");

let cg = new ChessGame();
let engine = new Engine(cg);
engine.getRecommendedMove(3);

export {};
