import { helpers } from "../../../ui/util";

const Player = ({
	p,
	season,
	userTid,
}: {
	p: any;
	season: number;
	userTid: number;
}) => {
	if (!p) {
		return <div />;
	}

	// The wrapper div here actually matters, don't change to fragment!
	return (
		<div>
			<span className={p.tid === userTid ? "table-info" : undefined}>
				{p.pos} <a href={helpers.leagueUrl(["player", p.pid])}>{p.name}</a> (
				<a href={helpers.leagueUrl(["roster", `${p.abbrev}_${p.tid}`, season])}>
					{p.abbrev}
				</a>
				)
			</span>
		</div>
	);
};

const Teams = ({
	className,
	name,
	nested = false,
	season,
	team,
	userTid,
}: {
	className?: string;
	name: string;
	nested?: boolean;
	season: number;
	team: any[];
	userTid: number;
}) => {
	let content;

	if (nested) {
		content = team.map(t => (
			<div className="mb-3" key={t.title}>
				<h3>{t.title}</h3>
				{t.players.map((p: any) =>
					p ? (
						<Player key={p.pid} p={p} season={season} userTid={userTid} />
					) : (
						""
					),
				)}
			</div>
		));
	} else if (team.length === 0) {
		content = <p>None</p>;
	} else {
		content = team
			.filter(p => p)
			.map(p => <Player key={p.pid} p={p} season={season} userTid={userTid} />);
	}

	return (
		<div className={className}>
			<h2>{name}</h2>
			{content}
		</div>
	);
};

export default Teams;
