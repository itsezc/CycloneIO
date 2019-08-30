import { MapRootObject, IndexRootObject, LogicRootObject, AssetsRootObject, VisualizationRootObject } from '../models'

export interface IPetMapper {
    mapIndex(indexObject: IndexRootObject, map: MapRootObject): this
    mapLogic(logicObject: LogicRootObject, map: MapRootObject): this
    mapAssets(assetsObject: AssetsRootObject, map: MapRootObject): this
    mapVisualizations(visualizationObject: VisualizationRootObject, map: MapRootObject): this
}