import { bySport } from "../../common";
import { groupBy } from "../../common/groupBy";
import type { Player } from "../../common/types";
import helpers from "./helpers";

const awardsOrder = [
	"Inducted into the Hall of Fame",
	"Most Valuable Player",
	"Won Championship",
	"Finals MVP",
	"Semifinals MVP",
	"Defensive Player of the Year",
	"Goalie of the Year",
	"Sixth Man of the Year",
	"Most Improved Player",
	"Rookie of the Year",
	"Offensive Rookie of the Year",
	"Defensive Rookie of the Year",
	"First Team All-League",
	"Second Team All-League",
	"Third Team All-League",
	"First Team All-Defensive",
	"Second Team All-Defensive",
	"Third Team All-Defensive",
	"All-Rookie Team",
	"All-Star MVP",
	"All-Star",
	"Slam Dunk Contest Winner",
	"Three-Point Contest Winner",
	...bySport({
		baseball: [
			"League HR Leader",
			"League RBI Leader",
			"League Runs Leader",
			"League Stolen Bases Leader",
			"League Walks Leader",
			"League Wins Leader",
			"League Strikeouts Leader",
			"League WAR Leader",
		],
		basketball: [
			"League Scoring Leader",
			"League Rebounding Leader",
			"League Assists Leader",
			"League Steals Leader",
			"League Blocks Leader",
		],
		football: [
			"League Passing Leader",
			"League Rushing Leader",
			"League Receiving Leader",
			"League Scrimmage Yards Leader",
		],
		hockey: [
			"League Points Leader",
			"League Goals Leader",
			"League Assists Leader",
		],
	}),
];

const groupAwards = (awards: Player["awards"], shortNames?: boolean) => {
	const getType = (originalType: string) => {
		if (!shortNames) {
			return originalType;
		}

		let type = originalType;

		if (type === "Inducted into the Hall of Fame") {
			type = "Hall of Fame";
		} else if (type === "Most Valuable Player") {
			type = "MVP";
		} else if (type === "Won Championship") {
			type = "Champion";
		} else if (type === "Finals MVP") {
			type = "FMVP";
		} else if (type === "Playoffs MVP") {
			type = "PMVP";
		} else if (type === "Semifinals MVP") {
			type = "SFMVP";
		} else if (type === "Defensive Player of the Year") {
			type = "DPOY";
		} else if (type === "Defensive Forward of the Year") {
			type = "DFOY";
		} else if (type === "Goalie of the Year") {
			type = "GOY";
		} else if (type === "Sixth Man of the Year") {
			type = "SMOY";
		} else if (type === "Most Improved Player") {
			type = "MIP";
		} else if (type === "Rookie of the Year") {
			type = "ROY";
		} else if (type === "Offensive Rookie of the Year") {
			type = "OROY";
		} else if (type === "Defensive Rookie of the Year") {
			type = "DROY";
		} else if (type === "Slam Dunk Contest Winner") {
			type = "Slam Dunk Contest";
		} else if (type === "Three-Point Contest Winner") {
			type = "Three-Point Contest";
		} else if (type.includes("All-League")) {
			type = "All-League";
		} else if (type.includes("All-Offensive")) {
			type = "All-Offensive";
		} else if (type.includes("All-Defensive")) {
			type = "All-Defensive";
		} else if (type.includes("All-Rookie")) {
			type = "All-Rookie";
		} else if (type.endsWith("Leader")) {
			type = type.replace("League ", "");
		}

		return type;
	};

	// Don't return First Team All-League when the group represents all All-League awards
	const getLong = (type: string, originalType: string) => {
		if (type.startsWith("All-")) {
			return type;
		}

		return originalType;
	};

	const seen = new Set();
	const awardsGrouped = [];
	const awardsGroupedTemp = groupBy(awards, award => getType(award.type));

	for (const originalType of awardsOrder) {
		const type = getType(originalType);
		const long = getLong(type, originalType);

		if (awardsGroupedTemp[type] && !seen.has(type)) {
			awardsGrouped.push({
				type,
				long,
				count: awardsGroupedTemp[type].length,
				seasons: helpers.yearRanges(awardsGroupedTemp[type].map(a => a.season)),
			});
			seen.add(type);
		}
	}

	// Handle non-default awards, just for fun if someone wants to add more
	for (const originalType of Object.keys(awardsGroupedTemp).sort()) {
		const type = getType(originalType);
		if (!seen.has(type)) {
			awardsGrouped.push({
				type,
				long: originalType,
				count: awardsGroupedTemp[type].length,
				seasons: helpers.yearRanges(awardsGroupedTemp[type].map(a => a.season)),
			});
			seen.add(type);
		}
	}

	return awardsGrouped;
};

export default groupAwards;
