import IUser from "./IUser";

import ICurrenciesManager from "./currencies/ICurrenciesManager";
import CurrenciesManager from "./currencies/CurrenciesManager";

import IBadgeManager from "./badges/IBadgeManager";
import BadgeManager from "./badges/BadgeManager";

export default class User implements IUser {
	public readonly id: number
	public name: string
	public motto: string
	public figure: string

	public score?: number
	public effect?: number
	public badges?: IBadgeManager
	public currencies?: ICurrenciesManager

	public clubDays?: number

	/**
	 * The user class refers to a player in the game.
	 *
	 * @param id     The unique identifier
	 * @param name   The name the user chose
	 * @param motto  The motto the user has
	 * @param figure The look the user's avatar has
	 */
	public constructor(
		id: number,
		name: string,
		motto: string,
		figure: string
	) {
		this.id = id
		this.name = name
		this.motto = motto
		this.figure = figure

		this.score = 0
		this.effect = 0
		this.badges = new BadgeManager()
		this.currencies = new CurrenciesManager()

		this.clubDays = 72
	}
}