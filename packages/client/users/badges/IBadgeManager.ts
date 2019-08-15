export default interface IBadgeManager {
	/**
	 * This method returns if the badge manager contains a badge by
	 * searching it by its code.
	 *
	 * @param code The badge code to search.
	 * @returns If the badge manager itself contains that badge.
	 */
	hasBadge(code: string): boolean

	/**
	 * This method adds a badge to the badge manager.
	 *
	 * @param code The badge code to add.
	 */
	addBadge(code: string): void
}