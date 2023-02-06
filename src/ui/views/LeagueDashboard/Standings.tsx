import classNames from "classnames";
import { helpers } from "../../util";
import { ColPtsOrGB, TeamColumn } from "../Standings";
import type { View } from "../../../common/types";

const width100 = {
	width: "100%",
};

const Standings = ({
	confTeams,
	maxPlayoffSeed,
	maxPlayoffSeedNoPlayIn,
	numConfs,
	playoffsByConf,
	pointsFormula,
	usePts,
	userTid,
}: Pick<
	View<"leagueDashboard">,
	| "confTeams"
	| "maxPlayoffSeed"
	| "maxPlayoffSeedNoPlayIn"
	| "numConfs"
	| "playoffsByConf"
	| "pointsFormula"
	| "usePts"
	| "userTid"
>) => {
	const maxRank = Math.max(...confTeams.map(t => t.rank));

	return (
		<>
			<table className="table table-striped table-borderless table-sm mb-1">
				<thead>
					<tr>
						<th style={width100}>Conference</th>
						<ColPtsOrGB
							alignRight
							pointsFormula={pointsFormula}
							usePts={usePts}
						/>
					</tr>
				</thead>
				<tbody>
					{confTeams.map((t, i) => {
						return (
							<tr
								key={t.tid}
								className={classNames({
									separator:
										(i === maxPlayoffSeed - 1 ||
											i === maxPlayoffSeedNoPlayIn - 1) &&
										(playoffsByConf || numConfs === 1),
									"table-info": t.tid === userTid,
								})}
							>
								<TeamColumn rank={t.rank} maxRank={maxRank} t={t} />
								<td className="text-end">
									{usePts ? Math.round(t.seasonAttrs.pts) : t.gb}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<a href={helpers.leagueUrl(["standings"])}>» League Standings</a>
		</>
	);
};

export default Standings;
