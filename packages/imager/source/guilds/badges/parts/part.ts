import BadgePartTypes from './types'

export default class BadgePart {
	public constructor(private readonly id: number, private readonly type: BadgePartTypes) {
		this.id = id
		this.type = type
	}

	public get Id(): number {
		return this.id
	}

	public get Type(): BadgePartTypes {
		return this.type
	}
}