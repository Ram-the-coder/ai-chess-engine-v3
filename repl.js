let { default: Engine } = await import("./src/ai/engine.js");
let { default: Game } = await import("./src/game.js");
let { default: Stats } = await import("./src/stats.js");

let cg = new Game();
let engine = new Engine(cg);
engine.getRecommendedMove(4);
// cg.move("Nc3");
// engine.getRecommendedMove(3);
// cg.move("c6");
// engine.getRecommendedMove(3);
// cg.move("d4");
// engine.getRecommendedMove(3);
// cg.move("Qa5");
// engine.getRecommendedMove(3);
export {};
