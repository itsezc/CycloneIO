import {
    MapRootObject, MapVisualization, VisualizationSize, VisualizationLayers,
    Directions, DirectionLayers, Animations, AnimationLayers
} from '../models/map'
import { AssetsRootObject } from '../models/assets'
import { IndexRootObject } from '../models/index'
import { LogicRootObject } from '../models/logic'
import { VisualizationRootObject, Visualization, AnimationLayer, Frame } from '../models/visualization'

import { ABSOLUTE_PATH } from './index'

import Path from 'path'
import FileSystem from 'fs';

export default class PetMapper {
    private readonly output: MapRootObject

    public constructor(private readonly assets: AssetsRootObject, private readonly index: IndexRootObject,
        private readonly logic: LogicRootObject, private readonly visualization: VisualizationRootObject) {
        this.assets = assets
        this.index = index
        this.logic = logic
        this.visualization = visualization

        this.output = {
            type: '',
            name: '',
            visualizationType: '',
            spritesheet: '',
            dimentions: {},
            directions: [],
            assets: {},
            visualizations: []
        }
    }

    public async generateMappedFile(pet: string): Promise<boolean> {

        return new Promise(async resolve => {
            await this.mapIndex(this.index, this.output)
            await this.mapLogic(this.logic, this.output)
            await this.mapAssets(this.assets, this.output)
            await this.mapVisualizations(this.visualization, this.output)

            const path = Path.join(ABSOLUTE_PATH, pet, `${pet}.json`)
            const stringifyJSON = JSON.stringify(this.output, null, 4)

            if (FileSystem.existsSync(path)) {
                resolve(false)
            }

            FileSystem.writeFileSync(path, stringifyJSON)

            resolve(true)
        })

    }

    private async mapIndex(indexObject: IndexRootObject, output: MapRootObject): Promise<void> {

        return new Promise(resolve => {
            let index = indexObject.object

            const { logic, type, visualization } = index

            output.type = logic
            output.name = type
            output.visualizationType = visualization
            output.spritesheet = `${output.name}_spritesheet.json`

            resolve()
        })

    }

    private async mapLogic(logicObject: LogicRootObject, output: MapRootObject): Promise<void> {

        return new Promise(resolve => {
            let dimentions = logicObject.objectData.model.dimensions

            output.dimentions.x = Number(dimentions.x)
            output.dimentions.y = Number(dimentions.y)
            output.dimentions.z = parseFloat(dimentions.z)

            let directions = logicObject.objectData.model.directions.direction

            directions.forEach(direction => {
                let directionId = Number(direction.id)

                output.directions.push(directionId)
            })

            resolve()
        })

    }

    private async mapAssets(assetsObject: AssetsRootObject, output: MapRootObject): Promise<void> {

        return new Promise(resolve => {
            let assets = assetsObject.assets.asset

            assets.forEach(asset => {
                const { name, source, x, y, flipH, usesPalette } = asset

                output.assets[name] = { source, x, y, flipH, usesPalette }
            })

            resolve()
        })

    }

    private async mapVisualizations(visualizationObject: VisualizationRootObject, output: MapRootObject): Promise<void> {

        return new Promise(resolve => {
            let visualizations = visualizationObject.visualizationData.graphics.visualization
            let visualizationSizes: VisualizationSize[] = [32, 64]

            visualizationSizes.forEach(async visualizationSize => {

                let visualization = visualizations.find(visualization => {
                    const { size } = visualization

                    return Number(size) === visualizationSize
                })

                await this.mapVisualization(visualization, visualizationSize, output)
            })

            resolve()
        })

    }

    private async mapVisualization(visualization: Visualization, size: VisualizationSize, output: MapRootObject): Promise<void> {

        return new Promise(resolve => {
            let layerCount = Number(visualization.layerCount)
            let angle = Number(visualization.angle)

            let visualizationLayers = visualization.layers.layer
            let visualizationDirections = visualization.directions.direction
            let visualizationAnimations = visualization.animations.animation

            let layers: VisualizationLayers = {}
            let directions: Directions = {}
            let animations: Animations = {}

            visualizationLayers.forEach(layer => {
                const { tag, alpha, ink, ignoreMouse, z } = layer

                let id = Number(layer.id)

                layers[id] = {
                    tag,
                    alpha,
                    ink,
                    ignoreMouse,
                    z
                }
            })

            visualizationDirections.forEach(direction => {
                let id = Number(direction.id)
                let layers: DirectionLayers = {}

                direction.layer.forEach(layer => {
                    let layerId = Number(layer.id)
                    let z = Number(layer.z)

                    layers[layerId] = {
                        z
                    }
                })

                directions[id] = {
                    layers
                }
            })

            visualizationAnimations.forEach(animation => {
                let id = Number(animation.id)

                let layers: AnimationLayers = {}

                let animationLayers = animation.animationLayer as AnimationLayer[]

                if (animationLayers !== undefined && animationLayers.length > 0) {

                    animationLayers.forEach(layer => {

                        let id = Number(layer.id)

                        let frames: number[] = []

                        let frameSequence = layer.frameSequence

                        if (frameSequence !== undefined) {

                            let visualizationFrames = frameSequence.frame as Frame[]

                            if (visualizationFrames !== undefined && visualizationFrames.length > 0) {

                                visualizationFrames.forEach(frame => {
                                    let id = Number(frame.id)

                                    frames.push(id)
                                })
                            }

                            let visualizationFrame = frameSequence.frame as Frame

                            let id = Number(visualizationFrame.id)

                            frames.push(id)
                        }

                        let loopCount = Number(layer.loopCount) || undefined

                        let frameRepeat = Number(layer.frameRepeat) || undefined

                        layers[id] = {
                            frames,
                            loopCount,
                            frameRepeat
                        }
                    })
                }

                animations[id] = layers
            })

            let outputVisualization: MapVisualization = {
                size,
                layerCount,
                angle,
                layers,
                directions,
                animations
            }

            output.visualizations.push(outputVisualization)

            resolve()
        })
    }
}