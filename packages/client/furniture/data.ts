namespace FurnitureData
{
	export interface IData {
		type: string;
		name: string;
		visualizationType: string;
		logicType: string;
		spritesheet: string;
		dimensions: IDimension;
		directions: number[];
		assets: { [key: string] : IAsset };
		visualization: IVisualization;
	}
	
	export interface IDimension {
		x: number;
		y: number;
		z: number;
	}
	
	export interface IAsset {
		source?: string;
		x: number;
		y: number;
		flipH?: boolean;
	}
	
	export interface IVisualization {
		layerCount: number;
		angle: number;
		layers?: { [key: string] : ILayer };
		colors?: { [key: string] : IColor };
		directions?: { [key: string] : IDirections };
		animations?: { [key: string] : IAnimation };
	}
	
	export interface ILayer {
		x?: number;
		y?: number;
		z?: number;
		alpha?: number;
		ink?: string;
		ignoreMouse?: boolean;
	}
	
	export interface IColor {
		layers: { [key: string] : IColorLayer };
	}
	
	export interface IColorLayer {
		color: number;
	}
	
	export interface IDirections {
		layers: { [key: string] : ILayer };
	}
	
	export interface IAnimation {
		layers: { [key: string] : IAnimationLayer };
	}
	
	export interface IAnimationLayer {
		loopCount?: number;
		frameRepeat?: number;
		frames: number[];
	}

	export interface IRoom 
	{
		door: [number, number]
		heightmap: number[][]
		furnitures: IFurniture[]
	}

	export interface IFurniture
	{
		name: string
		roomX: number
		roomY: number
		roomZ: number
		direction?: number
		animation?: number
		color?: number
		type?: IFurnitureType
		depth?: number
	}

	export enum IFurnitureType {
		FLOOR,
		WALL
	}
}

export default FurnitureData

/** NEW **/

export type Size = 1 | 32 | 64

export enum ItemType {	
	FLOOR = 'floor',
	WALL = 'wall'
}

export interface NameColorPair {
	itemName: string,
	color: number
}

export type Direction = 0 | 2 | 4 | 6

export type State = {
	count: number,
	transitionTo?: number,
	transition?: number
}

export const splitItemNameAndColor = (itemName: string): NameColorPair => {
	
	let color = 0

	if (itemName.includes('*'))
	{
		const furnitureName = itemName.split('*')
		itemName = furnitureName[0]
		color = parseInt(furnitureName[1])
	}

	return { itemName, color }
}

export type Description = {
    classname: string,
    name: string,
    description: string,
}

export type Furnidata = {
    roomitemtypes: {
        [id: number]: Description
    },
    wallitemtypes: {
        [id: number]: Description
    }
}

export type FurnidataType = 'wallitemtypes' | 'roomitemtypes'

//assets
export type FurniOffsetAsset = {
    name: string,
    flipH?: string,
    source?: string,
    x: string,
    y: string,
};

export type FurniOffsetAssetDictionary = {
    [id: string]: FurniOffsetAsset;
};

//misc
export type FurniOffsetType = "furniture_multistate" | "furniture_basic" | "furniture_animated";

//logic

export type FurniOffsetLogic = {
    dimensions: { x: string, y: string, z: string },
    directions: string[],
    type: FurniOffsetType,
};

//visualization
export type FurniOffsetVisualizationColorData = {
    layerId: string,
    color: string,
};
export type FurniOffsetVisualizationColor = {
    [colorId: string]: FurniOffsetVisualizationColorData[],
};
export type FurniOffsetVisualizationLayerData = {
    id: string,
    ink?: string,
    alpha?: string,
    ignoreMouse?: string,
    z?: string,
};
export type FurniOffsetVisualizationLayerOverrideData = {
    layerId: string,
    ink?: string,
    ignoreMouse?: string,
    z?: string,
};
export type FurniOffsetVisualizationAnimation = {
    id: string,
    transitionTo?: string,
    layers: {
        layerId: string,
        frameSequence: string[],
    }[],
};
export type FurniOffsetVisualizationData = {
    angle: string,
    layerCount: string,
    size: string,
    directions: { [directionId: string]: FurniOffsetVisualizationLayerOverrideData[] },
    layers: FurniOffsetVisualizationLayerData[],
    colors?: FurniOffsetVisualizationColor,
    animations?: { [animationId: string]: FurniOffsetVisualizationAnimation },
};
export type FurniOffsetVisualization = {
    type: FurniOffsetType,
    1: FurniOffsetVisualizationData,
    32: FurniOffsetVisualizationData,
    64: FurniOffsetVisualizationData,
};

export type Offset = {
    type: string,
    assets: FurniOffsetAssetDictionary,
    visualization: FurniOffsetVisualization,
    logic: FurniOffsetLogic
}