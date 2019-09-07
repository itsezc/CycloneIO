import IBadgeManager from "./badges/IBadgeManager";
import ICurrenciesManager from "./currencies/ICurrenciesManager";

export default interface IUser {
	readonly id: number
	name: string
	motto: string
	figure: string

	score?: number
	effect?: number
	badges?: IBadgeManager
	currencies?: ICurrenciesManager

	clubDays?: number
}