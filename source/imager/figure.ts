import * as Path from 'path'

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
	public static illegalMapping: Map<Action, Action[]> = new Map()
	
	public constructor()
	{
		this.CARRY = new Action('crr', 'Carry an item')
		this.DRINK = new Action('drk', 'Drink an item')
		this.STAND = new Action('std', 'Stand, default')
		this.SIT = new Action('sit', 'Sit on the floor')
		this.LAY = new Action('sit', 'Lay on the floor')
		this.WALK = new Action('walk', 'Taking a step')
		this.WAVE = new Action('wav', 'Waving')
		
		Actions.illegalMapping.set(this.STAND, [this.SIT, this.LAY, this.WALK])
		Actions.illegalMapping.set(this.SIT, [this.STAND, this.LAY, this.WALK])
		Actions.illegalMapping.set(this.LAY, [this.STAND, this.SIT, this.WALK, this.WAVE])
		Actions.illegalMapping.set(this.WALK, [this.STAND, this.SIT, this.LAY])
		Actions.illegalMapping.set(this.WAVE, [this.LAY])
	} 

	public static illegalCombination(action1: Action, action2: Action): boolean 
	{
		if (this.illegalMapping.has(action1)) 
		{
			let illegals = this.illegalMapping.get(action1)

			if(illegals != undefined && illegals.indexOf(action2)) 
				return true
		}

		return false
	}
}

export class Action
{
	private readonly _key: string
	private readonly _description: string

	public constructor(key: string, description: string)
	{
		this._key = key
		this._description = description
	}

	public get key(): string 
	{
		return this._key
	}

	public get description(): string 
	{
		return this._description
	}

	public illegalCombination(actionTwo: Action) {
		return Actions.illegalCombination(this, actionTwo)
	}
}


export enum Gestures {
	STANDARD = 'std',
	SMILE = 'sml',
	SAD = 'sad',
	ANGRY = 'agr',
	SURPRISED = 'srp',
	EYEBLINK = 'eyb',
	SPEAK = 'spk'
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
	private _coloringFrom: PartType | undefined
	public rotationOffset: number[] = []

	public constructor(key: string, bodyLocation: BodyLocation, order: number, coloringFrom?: PartType){
		this._key = key
		this._bodyLocation = bodyLocation
		this._order = order
		this._coloringFrom = coloringFrom
	}

	public get key(): string
	{
		return this._key
	}
	
	public get order(): number
	{
		return this._order
	}
	
	public get bodyLocation() 
	{
		return this._bodyLocation
	}

	public get coloringFrom(): number | PartType
	{
		if(this._coloringFrom) {
			return this._coloringFrom
		}

		return this
	}
}

export class SetPart 
{

	private _id: number
	public _type: PartType
	private _colorable: boolean
	private _index: number
	private _colorIndex: number
	private _order: number

	public constructor(id: number, type: PartType, colorable: boolean, index: number, colorIndex: number){
		this._id = id
		this._type = type
		this._colorable = colorable
		this._index = index
		this._colorIndex = colorIndex
		this._order = type.order
	}	

	public get id(): number
	{
		return this._id
	}

	get type(): PartType
	{
		return this._type
	}

	public get colorable(): boolean
	{
		return this._colorable
	}

	public get index(): number
	{
		return this._index
	}

	public get colorIndex(): number
	{
		return this._colorIndex
	}

	public get order(): number
	{
		return this._order
	}

	public set order(order: number)
	{
		this._order = order
	}
}

export class PartTypes
{

	private parts: {[key: string]: PartType} = {}

	public constructor()
	{
		this.parts['SHOES'] = new PartType('sh', BodyLocation.BODY, 5)
		this.parts['LEGS'] = new PartType('lg', BodyLocation.BODY, 6)
		this.parts['CHEST'] = new PartType('ch', BodyLocation.BODY, 7)
		this.parts['WAIST'] = new PartType('wa', BodyLocation.BODY, 8)
		this.parts['CHEST_ACCESSORY'] = new PartType('ca', BodyLocation.BODY, 9)
		this.parts['FACE_ACCESSORY'] = new PartType('fa', BodyLocation.HEAD, 27)
		this.parts['EYE_ACCESSORY'] = new PartType('ea', BodyLocation.HEAD, 28)
		this.parts['HEAD_ACCESSORY'] = new PartType('ha', BodyLocation.HEAD, 20)
		this.parts['HEAD_EXTRA'] = new PartType('he', BodyLocation.HEAD, 20)
		this.parts['CHEST_COVER'] = new PartType('cc', BodyLocation.BODY, 21)
		this.parts['CHEST_PIECE'] = new PartType('cp', BodyLocation.BODY, 6)
		this.parts['HEAD'] = new PartType('hd', BodyLocation.HEAD, 22)

		let CHEST = this.parts['CHEST']
		let HEAD = this.parts['HEAD']

		this.parts['BODY'] = new PartType('bd', BodyLocation.BODY, 1, HEAD)
		this.parts['FACIAL_CONTOURS'] = new PartType('fc', BodyLocation.HEAD, 23, HEAD)
		this.parts['HAIR'] = new PartType('hr', BodyLocation.HEAD, 24)

		let HAIR = this.parts['HAIR']

		this.parts['LEFT_ARM_LARGE'] = new PartType('lh', BodyLocation.BODY, 5, HEAD)
		this.parts['LEFT_ARM_SMALL'] = new PartType('ls', BodyLocation.BODY, 6, CHEST)
		this.parts['RIGHT_ARM_LARGE'] = new PartType('rh', BodyLocation.BODY, 10, HEAD)
		this.parts['RIGHT_ARM_SMALL'] = new PartType('rs', BodyLocation.BODY, 11, CHEST)
		this.parts['EYE'] = new PartType('ey', BodyLocation.HEAD, 24)
		this.parts['LEFT_HAND_ITEM'] = new PartType('li', BodyLocation.BODY, 0)
		this.parts['HAIR_BACK'] = new PartType('hrb', BodyLocation.HEAD, 26, HAIR)
		this.parts['RIGHT_HAND_ITEM'] = new PartType('ri', BodyLocation.BODY, 26)
		this.parts['LEFT_ARM_CARRY'] = new PartType('lc', BodyLocation.BODY, 23, HEAD)
		this.parts['RIGHT_ARM_CARRY'] = new PartType('rc', BodyLocation.BODY, 24, HEAD)
		this.parts['EFFECT'] = new PartType('fx', BodyLocation.BODY, 100)

		this.parts['LEFT_ARM_SMALL'].rotationOffset[3] = 1
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
	private _parts: Map<PartType, SetPart[]> = new Map()
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
			this._parts.set(part.type, [])
        
		this._parts.get(part.type)!.push(part)
	}
}


export const XML_FOLDER = 'resources/xml'
export const AVATAR_FOLDER = 'resoruces/avatar/'
export const ASSET_FOLDER = Path.join(XML_FOLDER, 'assets')
export const FIGURE_DATA = 'figuredata.xml'
export const FIGURE_MAP = 'figuremap.xml'

export class AvatarDataLoader {

    private _figureData: Map<any, any> = new Map()
    private _figureMap: Map<number, string> = new Map()
    private _assetOffsetMap: Map<any, any> = new Map()
    private _colorMap: Map<any, any> = new Map()

    public getPartName(id: number): string
    {
		if(this._figureMap.has(id))
			return this._figureMap.get(id)!

        return ''
    }

    public load()
    {

        const loadFigureMap = () => {}
        const loadFigureData = () => {}
        const loadAssetOffsetMap = () => {}

        loadFigureMap()
        loadFigureData()
        loadAssetOffsetMap()

        console.log('Finished Loading Avatar Data')
    }

    public get figureData(): Map<any, any>
    {
        return this._figureData
    }

    public get figureMap(): Map<number, string>
    {
        return this._figureMap
    }

    public get assetOffsetMap(): Map<any, any>
    {
        return this._assetOffsetMap
    }

    public get colorMap(): Map<any, any>
    {
        return this._colorMap
    }
}

