import * as Path from 'path'

export class Action
{
	private readonly _key: string
	private readonly _description: string

	public constructor(key: string, description: string)
	{
		this._key = key
		this._description = description
	}

	public get key(): string {
		return this.key
	}

	public get description(): string {
		return this.description
	}

	// #TODO 
	illegalCombination(action: any) {
		return 
	}
}

interface Object {
	key: string,
	key2: string
}

export class Actions 
{
	
	public DRINK: Action
	public CARRY: Action
	public STAND: Action
	public SIT: Action
	public LAY: Action
	public WALK: Action
	public WAVE: Action
	
	// #TODO: Swap to ES6 Map: https://howtodoinjava.com/typescript/maps/
	static illegalMapping: Array<Action>
	
	public constructor()
	{
		this.CARRY = new Action('crr', 'Carry an item')
		this.DRINK = new Action('drk', 'Drink an item')
		this.STAND = new Action('std', 'Stand, default')
		this.SIT = new Action('sit', 'Sit on the floor')
		this.LAY = new Action('sit', 'Lay on the floor')
		this.WALK = new Action('walk', 'Taking a step')
		this.WAVE = new Action('wav', 'Waving')
		
		Actions.illegalMapping = []
		Actions.illegalMapping[this.STAND.key] = [this.SIT, this.LAY, this.WALK]
		Actions.illegalMapping[this.SIT.key] = [this.STAND, this.LAY, this.WALK]
		Actions.illegalMapping[this.LAY.key] = [this.STAND, this.SIT, this.WALK, this.WAVE]
		Actions.illegalMapping[this.WALK.key] = [this.STAND, this.SIT, this.LAY]
		Actions.illegalMapping[this.WAVE.key] = [this.LAY]
	} 

	public static illegalCombinations(action1: Action, action2: Action): boolean 
	{
		if(this.illegalMapping.indexOf(action1)) 
		{
			let illegals = this.illegalMapping[action1.key]

			if(illegals.indexOf(action2)) 
				return true

			return false
		}
	}
}


export class Gestures {

	private gestures: Array<String>

	public constructor() {
		this.gestures = []
		this.gestures['STANDARD'] = 'std'
		this.gestures['SMILE'] = 'sml'
		this.gestures['SAD'] = 'sad'
		this.gestures['ANGRY'] = 'agr'
		this.gestures['SURPRISED'] = 'srp'
		this.gestures['EYEBLINK'] = 'eyb'
		this.gestures['SPEAK'] = 'spk'
	}

	public getGesture(key: string)
	{
		if(this.gestures.indexOf(key)) 
		{
			return this.gestures[key]
		}
	}

}


export class Size
{

	public _key: string
	public _prefix: string
	public _resizeFactor: number
	public _size: number[]

	public constructor(key: string, prefix: string, resizeFactor: number, size: number[])  
	{
		this._key = key
		this._prefix = prefix
		this._resizeFactor = resizeFactor
		this._size = size
	}
	
	get key(): string
	{
		return this._key
	}

	get prefix(): string
	{
		return this._prefix
	}

	get resizeFactor(): number
	{
		return this._resizeFactor
	}

	get size(): number[]
	{
		return this._size
	}
}

export class Sizes
{
	
	private SMALL: Size
	private NORMAL: Size
	private LARGE: Size
	private XLARGE: Size

	public constructor()
	{
		this.SMALL = new Size('s', 'sh', 1, [33, 56])
		this.NORMAL = new Size('m', 'h', 1, [64, 110])
		this.LARGE = new Size('l', 'h', 2, [64, 110])
		this.XLARGE = new Size('xl', 'h', 3, [64, 110])
	}

}

enum BodyLocation
{
	BODY = 'body',
	HEAD = 'head'
}

class PartType
{

	private _key: string
	private _order: number
	private _bodyLocation: BodyLocation
	private _coloringFrom: number
	private rotationOffset: any = {}

	public constructor(key: string, bodyLocation: BodyLocation, order: number, coloringFrom?: number){
		this._key = key
		this._bodyLocation = bodyLocation
		this._order = order
		this._coloringFrom = coloringFrom
	}

	get key() 
	{
		return this._key
	}
	
	get order() 
	{
		return this._order
	}
	
	get bodyLocation() 
	{
		return this._bodyLocation
	}

	get coloringFrom(): number | PartType
	{
		if(!this._coloringFrom) {
			return this._coloringFrom
		}

		return this
	}
}

export class SetPart 
{
	def __init__(self, id: int, type: PartType, colorable: bool, index: int, color_index: int):
	self.__id: int = id
	self.__type: PartType = type
	self.__colorable: bool = colorable
	self.__index: int = index
	self.__color_index: int = color_index
	self.__order: int = self.__type.order

@property
def id(self) -> int:
	return self.__id

@property
def type(self) -> PartType:
	return self.__type

@property
def colorable(self) -> bool:
	return self.__colorable

@property
def index(self) -> int:
	return self.__index

@property
def color_index(self) -> int:
	return self.__color_index

@property
def order(self) -> int:
	return self.__order


	public set order(order: number)
	{
		this._order = order
	}

	public get order()
	{
		return this._order
	}

	public get copy()
	{
		return this._copy
	}
}

export class PartTypes
{

	private parts: [PartType]

	public constructor()
	{
		this.parts['SHOES'] = new PartType('sh', BodyLocation.BODY, 5, null)
		this.parts['LEGS'] = new PartType('lg', BodyLocation.BODY, 6, null)
		this.parts['CHEST'] = new PartType('ch', BodyLocation.BODY, 7, null)
		this.parts['WAIST'] = new PartType('wa', BodyLocation.BODY, 8, null)
		this.parts['CHEST_ACCESSORY'] = new PartType('ca', BodyLocation.BODY, 9, null)
		this.parts['FACE_ACCESSORY'] = new PartType('fa', BodyLocation.HEAD, 27, null)
		this.parts['EYE_ACCESSORY'] = new PartType('ea', BodyLocation.HEAD, 28, null)
		this.parts['HEAD_ACCESSORY'] = new PartType('ha', BodyLocation.HEAD, 20, null)
		this.parts['HEAD_EXTRA'] = new PartType('he', BodyLocation.HEAD, 20, null)
		this.parts['CHEST_COVER'] = new PartType('cc', BodyLocation.BODY, 21, null)
		this.parts['CHEST_PIECE'] = new PartType('cp', BodyLocation.BODY, 6, null)
		this.parts['HEAD'] = new PartType('hd', BodyLocation.HEAD, 22, null)

		let CHEST = this.parts['CHEST']
		let HEAD = this.parts['HEAD']

		this.parts['BODY'] = new PartType('bd', BodyLocation.BODY, 1, HEAD)
		this.parts['FACIAL_CONTOURS'] = new PartType('fc', BodyLocation.HEAD, 23, HEAD)
		this.parts['HAIR'] = new PartType('hr', BodyLocation.HEAD, 24, null)

		let HAIR = this.parts['HAIR']

		this.parts['LEFT_ARM_LARGE'] = new PartType('lh', BodyLocation.BODY, 5, HEAD)
		this.parts['LEFT_ARM_SMALL'] = new PartType('ls', BodyLocation.BODY, 6, CHEST)
		this.parts['RIGHT_ARM_LARGE'] = new PartType('rh', BodyLocation.BODY, 10, HEAD)
		this.parts['RIGHT_ARM_SMALL'] = new PartType('rs', BodyLocation.BODY, 11, CHEST)
		this.parts['EYE'] = new PartType('ey', BodyLocation.HEAD, 24, null)
		this.parts['LEFT_HAND_ITEM'] = new PartType('li', BodyLocation.BODY, 0, null)
		this.parts['HAIR_BACK'] = new PartType('hrb', BodyLocation.HEAD, 26, HAIR)
		this.parts['RIGHT_HAND_ITEM'] = new PartType('ri', BodyLocation.BODY, 26, null)
		this.parts['LEFT_ARM_CARRY'] = new PartType('lc', BodyLocation.BODY, 23, HEAD)
		this.parts['RIGHT_ARM_CARRY'] = new PartType('rc', BodyLocation.BODY, 24, HEAD)
		this.parts['EFFECT'] = new PartType('fx', BodyLocation.BODY, 100, null)

		this.['LEFT_ARM_SMALL'].rotationOffset[3] = 1
	}


	public getPartType(key: string) : PartType | null
	{
		if(this.parts[key] instanceof PartType && this.parts[key])
		{
			return this.parts[key]
		}

		return null
	}
	
}

export class SetType
{

	private _type: PartType
	private _paletteID: number

	public constructor(type: PartType, paletteID: number)
	{
		this._type = type
		this._paletteID = paletteID
	}
	
	public get type()
	{
		return this._type
	}
	
	public get paletteID()
	{
		return this._paletteID
	}
}

export class Set {
	
	private _id: number
	private _name: string
	private _gender: string
	private _club: number
	private _colorable: boolean
	private _selectable: boolean
	private _preselectable: boolean
	private _parts: any = new Map()
	private _hiddenLayers: any[] = []

	public constructor(id: number, name: string, gender: string, club: number, colorable: boolean, selectable: boolean, preselectable: boolean)
	{
		this._id = id
		this._name = name
		this._gender = gender
		this._club = club
		this._colorable = colorable
		this._selectable = selectable
		this._preselectable = preselectable
	}

	public addPart(part: SetPart)
	{
		if(!this._parts.has(part.type))
			this._parts[part.type] = part
	}
}

export const XML_FOLDER = 'resources/xml'
export const AVATAR_FOLDER = 'resoruces/avatar/'
export const ASSET_FOLDER = Path.join(XML_FOLDER, 'assets')
export const FIGURE_DATA = 'figuredata.xml'
export const FIGURE_MAP = 'figuremap.xml'

