export enum RoomType {
	PUBLIC,
	PRIVATE
}

export enum AccessType {
	PASSWORD,
	DOORBELL,
	OPEN,
	INVISIBLE
}

export default class Room {

	public constructor(private readonly id: number, private readonly type: RoomType,

					   private readonly owner: number, private readonly group: number,

					   private readonly name: string, private readonly description: string, private readonly tags: string[],

					   private readonly accessType: AccessType) {
		this.id = id
		this.type = type

		this.owner = owner
		this.group = group

		this.name = name
		this.description = description
	}

	public get Id(): number {
		return this.id
	}
}