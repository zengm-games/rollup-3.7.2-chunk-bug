import classNames from "classnames";
import useTitleBar from "../hooks/useTitleBar";
import { helpers, logEvent, realtimeUpdate, toWorker } from "../util";
import type { View } from "../../common/types";
import { Mood, RatingsStatsPopover } from "../components";
import { isSport } from "../../common";

// Show the negotiations list if there are more ongoing negotiations
const redirectNegotiationOrRoster = async (cancelled: boolean) => {
	const count = await toWorker("main", "countNegotiations", undefined);
	if (count > 0) {
		realtimeUpdate([], helpers.leagueUrl(["negotiation"]));
	} else if (cancelled || isSport("football")) {
		// After signing player in football, go back to free agents screen, cause you probably need more
		realtimeUpdate([], helpers.leagueUrl(["free_agents"]));
	} else {
		realtimeUpdate([], helpers.leagueUrl(["roster"]));
	}
};

const cancel = async (pid: number) => {
	await toWorker("main", "cancelContractNegotiation", pid);
	redirectNegotiationOrRoster(true);
};

const sign = async (pid: number, amount: number, exp: number) => {
	const errorMsg = await toWorker("main", "acceptContractNegotiation", {
		pid: pid,
		amount: Math.round(amount * 1000),
		exp,
	});
	if (errorMsg !== undefined && errorMsg) {
		logEvent({
			type: "error",
			text: errorMsg,
			saveToDb: false,
		});
	}
	redirectNegotiationOrRoster(false);
};

const Negotiation = ({
	challengeNoRatings,
	contractOptions,
	payroll,
	player = {},
	resigning,
	salaryCap,
	salaryCapType,
}: View<"negotiation">) => {
	useTitleBar({ title: `Contract Negotiation - ${player.name}` });

	let message;
	if (resigning && salaryCapType === "soft") {
		message = (
			<p>
				You are allowed to go over the salary cap to make this deal because you
				are re-signing{" "}
				<a href={helpers.leagueUrl(["player", player.pid])}>{player.name}</a> to
				a contract extension.{" "}
				<b>
					If you do not come to an agreement here,{" "}
					<a href={helpers.leagueUrl(["player", player.pid])}>{player.name}</a>{" "}
					will become a free agent.
				</b>{" "}
				He will then be able to sign with any team, and you won't be able to go
				over the salary cap to sign him.
			</p>
		);
	} else if (salaryCapType !== "none") {
		const extra =
			salaryCapType === "soft" ? (
				<>
					{" "}
					because{" "}
					<a href={helpers.leagueUrl(["player", player.pid])}>
						{player.name}
					</a>{" "}
					is a free agent
				</>
			) : null;

		message = (
			<p>
				You are not allowed to go over the salary cap to make this deal (unless
				it is for a minimum contract){extra}.
			</p>
		);
	}

	return (
		<>
			{message}

			<p>
				Current Payroll: {helpers.formatCurrency(payroll, "M")}
				{salaryCapType !== "none" ? (
					<>
						<br />
						Salary Cap: {helpers.formatCurrency(salaryCap, "M")}
					</>
				) : null}
			</p>

			<h2>
				{" "}
				<a href={helpers.leagueUrl(["player", player.pid])}>
					{player.name}
				</a>{" "}
			</h2>
			<div className="d-flex align-items-center">
				<Mood defaultType="user" p={player} />
				<RatingsStatsPopover pid={player.pid} />
			</div>
			<p className="mt-2">
				{player.age} years old
				{!challengeNoRatings
					? `; Overall: ${player.ratings.ovr}; Potential: ${player.ratings.pot}`
					: null}
			</p>

			<div className="row">
				<div className="col-sm-10 col-md-8 col-lg-6">
					<div className="list-group">
						{contractOptions.map((contract, i) => {
							return (
								<div
									key={i}
									className={classNames(
										"d-flex align-items-center list-group-item",
										{
											"list-group-item-success": contract.smallestAmount,
										},
									)}
								>
									<div className="flex-grow-1">
										{helpers.formatCurrency(contract.amount, "M")} per year
										<span className="d-none d-sm-inline">
											, through {contract.exp}
										</span>{" "}
										({contract.years}{" "}
										{contract.years === 1 ? "season" : "seasons"})
									</div>

									<button
										className="btn btn-success"
										onClick={() =>
											sign(player.pid, contract.amount, contract.exp)
										}
									>
										Sign
										<span className="d-none d-sm-inline"> Contract</span>
									</button>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			<button
				className="btn btn-danger mt-3"
				onClick={() => cancel(player.pid)}
			>
				Can't reach a deal? End negotiation
			</button>
		</>
	);
};

export default Negotiation;
