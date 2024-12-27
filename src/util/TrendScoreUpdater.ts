import cache from "cache";
import debug from "debug";

export default class TrendScoreUpdater {
  private static timeout: NodeJS.Timeout | null = null;
  private static lastReactions: { [momentId: number]: number } | undefined;
  private static lastViews: { [momentId: number]: number } | undefined;

  private static log = debug("app:log:trend_score_updater");

  private static async update() {
    let reactions: Record<number, number> | null;
    let views: Record<number, number> | null;

    await Promise.all([
      (reactions = await cache.moment.getReactionCounts()),
      (views = await cache.moment.getViews()),
    ]);

    const momentIds = [
      ...new Set([
        ...Object.keys(reactions ?? {}),
        ...Object.keys(views ?? {}),
      ]),
    ].map((id) => parseInt(id));

    await Promise.all(
      momentIds.map(async (momentId) => {
        const lastR = TrendScoreUpdater.lastReactions?.[momentId] ?? 0;
        const lastV = TrendScoreUpdater.lastViews?.[momentId] ?? 0;

        const r = reactions?.[momentId] ?? 0;
        const v = views?.[momentId] ?? 0;

        const rGrowth = (r - lastR) / (lastR + 1);
        const vGrowth = (v - lastV) / (lastV + 1);

        const score = (rGrowth * 7 + vGrowth * 3) * 7 + (r * 7 + v * 3) * 3;

        if (score < 200) return;
        await cache.moment.setTrendScore({ momentId, score });
      })
    );

    TrendScoreUpdater.log(
      `Updated trend scores of ${momentIds.length} moments`
    );
  }

  public static stop(): void {
    if (TrendScoreUpdater.timeout === null) return;
    clearInterval(TrendScoreUpdater.timeout);
    TrendScoreUpdater.timeout = null;
  }

  public static start(): void {
    TrendScoreUpdater.update();
    TrendScoreUpdater.timeout = setInterval(
      TrendScoreUpdater.update,
      60 * 1000
    );
  }
}
