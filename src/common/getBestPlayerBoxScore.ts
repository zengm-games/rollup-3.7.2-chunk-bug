import orderBy from "lodash-es/orderBy";
import bySport from "./bySport";
import processPlayerStats from "./processPlayerStats";

const getBestPlayerBoxScore = (players: any[]) => {
	if (players.length === 0) {
		return;
	}

	const withFactors = (factors: [string, number][]) => {
		const stats = factors.map(factor => factor[0]);

		const scores = players.map(p => {
			const processedStats = processPlayerStats(p, stats);

			const components: [string, number][] = factors.map(([stat, weight]) => [
				stat,
				processedStats[stat] * weight,
			]);

			const score = components.reduce((sum, value) => sum + value[1], 0);
			return {
				components,
				p,
				processedStats,
				score,
			};
		});

		const best = orderBy(scores, "score", "desc")[0];

		const componentsSorted = orderBy(best.components, "1", "desc").slice(0, 3);

		const statTexts = [];
		for (const [stat, score] of componentsSorted) {
			if (score > 0) {
				statTexts.push(stat);
			}
		}

		// Sort to be same order as `factors` above
		const statTextsSorted = orderBy(
			statTexts,
			stat => factors.findIndex(row => row[0] === stat),
			"asc",
		);

		return {
			p: best.p,
			processedStats: best.processedStats,
			statTexts: statTextsSorted,
		};
	};

	return bySport({
		baseball: () => {
			// The offensive ones are based on WAR formula components. Pitching ones are not ideal because we can't currently represent "lower is better" stats like ER.
			const factors: [string, number][] = [
				["h", 0.47],
				["2b", 0.38],
				["3b", 0.55],
				["hr", 0.93],
				["bb", 0.33],
				["hbp", 0.33],
				["sb", 0.3],
				["sho", 10],
				["so", 0.1],
			];

			return withFactors(factors);
		},
		basketball: () => {
			// Based on https://fansided.com/2017/04/10/updating-dre-tweaks/ but with blk increased because otherwise it'd basically never get selected, and pts lower to account for the negative terms kind of
			const factors: [string, number][] = [
				["pts", 0.5],
				["trb", 0.5],
				["ast", 0.5],
				["blk", 1.7],
				["stl", 1.7],
			];

			return withFactors(factors);
		},
		football: () => {
			// Based on fantasy points, with added stuff for defense too
			const defScale = 0.85;
			const factors: [string, number][] = [
				["pssYds", 1 / 25],
				["pssTD", 4],
				["rusYds", 1 / 10],
				["recYds", 1 / 10],
				["rusTD", 6],
				["recTD", 6],
				["prTD", 6],
				["krTD", 6],
				["defTckSolo", 1.5 * defScale],
				["defTckAst", 0.75 * defScale],
				["defTckLoss", 2 * defScale],
				["defSk", 4 * defScale],
				["defInt", 5 * defScale],
				["defFmbFrc", 4 * defScale],
				["defFmbRec", 4 * defScale],
				["defIntTD", 6 * defScale],
				["defFmbTD", 6 * defScale],
				["defSft", 2 * defScale],
				["defPssDef", 1.5 * defScale],
			];

			return withFactors(factors);
		},
		hockey: () => {
			const factors: [string, number][] = [
				["g", 1],
				["a", 1],
				["s", 0.01],
				["so", 3],
				["sv", 0.0000001],
			];

			return withFactors(factors);
		},
	})();
};

export default getBestPlayerBoxScore;
