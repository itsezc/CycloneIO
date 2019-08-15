import IBadge from "./IBadge";
import IBadgeManager from "./IBadgeManager";

export default class BadgeManager implements IBadgeManager {
	private badges: IBadge[]

	/**
	 * The badge manager is a service on which you can add badges
	 * and search for a badge.
	 *
	 * @param badges The starting badge array if there's any
	 */
	public constructor(badges?: IBadge[]) {
		this.badges = badges || [];
	}

	/**
	 * This method returns if the badge manager contains a badge by
	 * searching it by its code.
	 *
	 * @param code The badge code to search.
	 * @returns If the badge manager itself contains that badge.
	 */
	public hasBadge(code: string): boolean {
		return this.badges.includes({ code })
	}

	/**
	 * This method adds a badge to the badge manager.
	 *
	 * @param code The badge code to add.
	 */
	public addBadge(code: string) {
		this.badges.push({ code })
	}
}