export default interface ICurrenciesManager {
	/**
	 * This method adds to the quantity of credits stored a
	 * specific value.
	 *
	 * @param value The quantity of credits to add.
	 */
	addCredits(value: number): void

	/**
	 * This method adds to the quantity of duckets stored a
	 * specific value.
	 *
	 * @param value The quantity of duckets to add.
	 */
	addDuckets(value: number): void

	/**
	 * This method adds to the quantity of diamonds stored a
	 * specific value.
	 *
	 * @param value The quantity of diamonds to add.
	 */
	addDiamonds(value: number): void
}