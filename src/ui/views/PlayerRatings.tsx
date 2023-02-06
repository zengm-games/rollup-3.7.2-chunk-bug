import { DataTable, MoreLinks } from "../components";
import useTitleBar from "../hooks/useTitleBar";
import { getCols, helpers } from "../util";
import { POSITIONS, PLAYER, bySport } from "../../common";
import type { View } from "../../common/types";
import {
	wrappedContractAmount,
	wrappedContractExp,
} from "../components/contract";
import { wrappedPlayerNameLabels } from "../components/PlayerNameLabels";

const PlayerRatings = ({
	abbrev,
	challengeNoRatings,
	currentSeason,
	players,
	ratings,
	season,
	userTid,
}: View<"playerRatings">) => {
	useTitleBar({
		title: "Player Ratings",
		jumpTo: true,
		jumpToSeason: season,
		dropdownView: "player_ratings",
		dropdownFields: { teamsAndAllWatch: abbrev, seasons: season },
	});

	const ovrsPotsColNames: string[] = [];
	if (
		bySport({
			baseball: true,
			basketball: false,
			football: true,
			hockey: true,
		})
	) {
		for (const pos of POSITIONS) {
			for (const type of ["ovr", "pot"]) {
				ovrsPotsColNames.push(`rating:${type}${pos}`);
			}
		}
	}

	const cols = getCols([
		"Name",
		"Pos",
		"Team",
		"Age",
		"Contract",
		"Exp",
		"Ovr",
		"Pot",
		...ratings.map(rating => `rating:${rating}`),
		...ovrsPotsColNames,
	]);

	const rows = players.map(p => {
		const showRatings = !challengeNoRatings || p.tid === PLAYER.RETIRED;

		const ovrsPotsRatings: string[] = [];
		if (
			bySport({
				baseball: true,
				basketball: false,
				football: true,
				hockey: true,
			})
		) {
			for (const pos of POSITIONS) {
				for (const type of ["ovrs", "pots"]) {
					ovrsPotsRatings.push(showRatings ? p.ratings[type][pos] : null);
				}
			}
		}

		return {
			key: p.pid,
			data: [
				wrappedPlayerNameLabels({
					pid: p.pid,
					injury: p.injury,
					season,
					skills: p.ratings.skills,
					jerseyNumber: p.stats.jerseyNumber,
					watch: p.watch,
					firstName: p.firstName,
					firstNameShort: p.firstNameShort,
					lastName: p.lastName,
					awards: p.awards,
					awardsSeason: season,
				}),
				p.ratings.pos,
				<a
					href={helpers.leagueUrl([
						"roster",
						`${p.stats.abbrev}_${p.stats.tid}`,
						season,
					])}
				>
					{p.stats.abbrev}
				</a>,
				p.age,
				p.contract.amount > 0 ? wrappedContractAmount(p) : null,
				p.contract.amount > 0 && season === currentSeason
					? wrappedContractExp(p)
					: null,
				showRatings ? p.ratings.ovr : null,
				showRatings ? p.ratings.pot : null,
				...ratings.map(rating => (showRatings ? p.ratings[rating] : null)),
				...ovrsPotsRatings,
			],
			classNames: {
				"table-danger": p.hof,
				"table-info": p.stats.tid === userTid,
			},
		};
	});

	return (
		<>
			<MoreLinks type="playerRatings" page="player_ratings" season={season} />

			{challengeNoRatings ? (
				<p className="alert alert-danger d-inline-block">
					<b>Challenge Mode:</b> All player ratings are hidden, except for
					retired players.
				</p>
			) : null}

			<p>
				Players on your team are{" "}
				<span className="text-info">highlighted in blue</span>. Players in the
				Hall of Fame are <span className="text-danger">highlighted in red</span>
				.
			</p>

			<DataTable
				cols={cols}
				defaultSort={[6, "desc"]}
				defaultStickyCols={window.mobile ? 0 : 1}
				name="PlayerRatings"
				pagination
				rows={rows}
			/>
		</>
	);
};

export default PlayerRatings;
