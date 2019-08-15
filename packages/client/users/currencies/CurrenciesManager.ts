import IDefaultCurrencies from "./IDefaultCurrencies";
import ICurrenciesManager from "./ICurrenciesManager";

export default class CurrenciesManager implements ICurrenciesManager {
	private currencies: IDefaultCurrencies

	/**
	 * The currencies manager is a service on which you can store
	 * the [[IDefaultCurrencies]], add them a value and retrieve them.
	 *
	 * @param currencies The starting currencies if they're different to zero.
	 */
	public constructor(currencies?: IDefaultCurrencies) {
		this.currencies = currencies || { credits: 0, duckets: 0, diamonds: 0 }
	}

	/**
	 * This method returns the manager stored credits.
	 *
	 * @returns number Manager credits quantity
	 */
	public get credits(): number {
		return this.currencies.credits
	}

	/**
	 * This method sets the manager stored credits to a
	 * new value.
	 *
	 * @param value The new credits quantity
	 */
	public set credits(value: number) {
		this.currencies.credits = value
	}

	/**
	 * This method adds to the quantity of credits stored a
	 * specific value.
	 *
	 * @param value The quantity of credits to add.
	 */
	public addCredits(value: number) {
		this.currencies.credits += value
	}

	/**
	 * This method returns the manager stored duckets.
	 *
	 * @returns number Manager duckets quantity
	 */
	public get duckets(): number {
		return this.currencies.duckets
	}

	/**
	 * This method sets the manager stored duckets to a
	 * new value.
	 *
	 * @param value The new duckets quantity
	 */
	public set duckets(value: number) {
		this.currencies.duckets = value
	}

	/**
	 * This method adds to the quantity of duckets stored a
	 * specific value.
	 *
	 * @param value The quantity of duckets to add.
	 */
	public addDuckets(value: number) {
		this.currencies.duckets += value
	}

	/**
	 * This method returns the manager stored diamonds.
	 *
	 * @returns number Manager diamonds quantity
	 */
	public get diamonds(): number {
		return this.currencies.diamonds
	}

	/**
	 * This method sets the manager stored diamonds to a
	 * new value.
	 *
	 * @param value The new diamonds quantity
	 */
	public set diamonds(value: number) {
		this.currencies.diamonds = value
	}

	/**
	 * This method adds to the quantity of diamonds stored a
	 * specific value.
	 *
	 * @param value The quantity of diamonds to add.
	 */
	public addDiamonds(value: number) {
		this.currencies.diamonds += value
	}
}