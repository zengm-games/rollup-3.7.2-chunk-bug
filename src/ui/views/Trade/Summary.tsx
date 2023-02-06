import { forwardRef } from "react";
import { helpers } from "../../util";
import type { View } from "../../../common/types";
import classNames from "classnames";
import { SafeHtml } from "../../components";
import { ContractAmount } from "../../components/contract";
import type { HandleToggle } from ".";

// Arrow is https://icons.getbootstrap.com/icons/arrow-right/ v1.8.1
export const OvrChange = ({
	after,
	before,
}: {
	after: number;
	before: number;
}) => {
	return (
		<>
			{before}{" "}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				fill="currentColor"
				viewBox="0 0 16 16"
				style={{ marginBottom: 1 }}
			>
				<path
					fillRule="evenodd"
					d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
				/>
			</svg>{" "}
			<span
				className={classNames({
					"text-success": after > before,
					"text-danger": before > after,
				})}
			>
				{after}
			</span>
		</>
	);
};

const Summary = forwardRef(
	(
		{
			challengeNoRatings,
			handleToggle,
			luxuryPayroll,
			salaryCap,
			salaryCapType,
			summary,
		}: Pick<
			View<"trade">,
			"luxuryPayroll" | "salaryCap" | "salaryCapType" | "summary"
		> & {
			challengeNoRatings: boolean;
			handleToggle: HandleToggle;
		},
		ref: any,
	) => {
		const payrollColorCutoff =
			salaryCapType === "none" ? luxuryPayroll : salaryCap;

		return (
			<div className="row trade-items mb-3" ref={ref}>
				{summary.teams.map((t, i) => {
					const userOrOther = i === 0 ? "other" : ("user" as const);

					return (
						<div
							key={i}
							className={classNames("col-md-12 col-6 d-flex flex-column", {
								"mb-md-3": i === 0,
							})}
						>
							<h4 className="fw-bold mb-1">{t.name} receive:</h4>
							<ul className="list-unstyled mb-1">
								{summary.teams[t.other].trade.map(p => (
									<li key={`p${p.pid}`} className="d-flex">
										<div>
											<a href={helpers.leagueUrl(["player", p.pid])}>
												{p.name}
											</a>{" "}
											({<ContractAmount p={p} />})
										</div>
										<button
											type="button"
											className="btn-close ms-1"
											title="Remove player from trade"
											onClick={() => {
												handleToggle(userOrOther, "player", "include", p.pid);
											}}
										/>
									</li>
								))}
								{summary.teams[t.other].picks.map(pick => (
									<li key={pick.dpid} className="d-flex">
										<SafeHtml dirty={pick.desc} />
										<button
											type="button"
											className="btn-close ms-1"
											title="Remove pick from trade"
											onClick={() => {
												handleToggle(userOrOther, "pick", "include", pick.dpid);
											}}
										/>
									</li>
								))}
								{summary.teams[t.other].trade.length > 0 ? (
									<li className="mt-1">
										{helpers.formatCurrency(summary.teams[t.other].total, "M")}{" "}
										total
									</li>
								) : null}
								{summary.teams[t.other].trade.length === 0 &&
								summary.teams[t.other].picks.length === 0 ? (
									<li>Nothing</li>
								) : null}
							</ul>
							<ul className="list-unstyled">
								<li>
									Payroll after trade:{" "}
									<span
										className={
											t.payrollAfterTrade > payrollColorCutoff
												? "text-danger"
												: undefined
										}
									>
										{helpers.formatCurrency(t.payrollAfterTrade, "M")}
									</span>
								</li>
								{salaryCapType !== "none" ? (
									<li>Salary cap: {helpers.formatCurrency(salaryCap, "M")}</li>
								) : (
									<li>
										Luxury tax: {helpers.formatCurrency(luxuryPayroll, "M")}
									</li>
								)}
								{!challengeNoRatings ? (
									<li>
										Team ovr:{" "}
										<OvrChange
											before={summary.teams[t.other].ovrBefore}
											after={summary.teams[t.other].ovrAfter}
										/>
									</li>
								) : null}
							</ul>
						</div>
					);
				})}
			</div>
		);
	},
);

export default Summary;
