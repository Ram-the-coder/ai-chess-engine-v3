import Stats from "../../src/stats";

describe("Stats", () => {
  test("records and returns count stat", () => {
    const MY_STAT = "my_stat";
    expect(Stats.getCount(MY_STAT)).toEqual(0);
    Stats.counter.incr(MY_STAT);
    expect(Stats.getCount(MY_STAT)).toEqual(1);
  });
});
