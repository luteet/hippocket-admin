import type { TransactionMilestone } from "@/types/api"
import ReferralRow from "./ReferralRow"

/** A single milestone with its referrals. */
export default function MilestoneCard({
	milestone,
}: {
	milestone: TransactionMilestone
}) {
	return (
		<div>
			<div className="mb-3 flex items-center justify-between">
				<h4 className="text-sm font-semibold">
					{milestone.name || `#${milestone.sort + 1}`}
				</h4>
				{milestone.target_date && (
					<span className="text-xs text-muted-foreground">
						Send Date: {milestone.target_date}
					</span>
				)}
			</div>
			{milestone.referrals.length > 0 ? (
				<div className="space-y-2">
					{milestone.referrals.map((ref) => (
						<ReferralRow key={ref.id} referral={ref} />
					))}
				</div>
			) : (
				<p className="text-sm text-muted-foreground">
					No referrals in this milestone.
				</p>
			)}
		</div>
	)
}