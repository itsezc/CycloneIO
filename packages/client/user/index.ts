import { default as Interface } from './interface'

export default class User {

	public score?: number
	public effect?: number
	public badges?: [Interface.IBadge] | []
	public currencies?: Interface.ICurrencies

	constructor(
		public id: number,
		public name: string,
		public motto: string,
		public figure: string
	) {
		this.score = 0
		this.effect = 0
		this.badges = []

		this.currencies = {
			credits: 0,
			duckets: 0,
			diamonds: 0
		}
	}
}