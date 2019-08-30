import { injectable } from 'inversify'

import { IPetMapper } from '../interfaces'

import {
    MapRootObject, IndexRootObject, LogicRootObject,
    AssetsRootObject, MapAssets, VisualizationRootObject,
    MapVisualizationSize, Visualization, MapVisualization, MapVisualizationLayers,
    MapDirections, MapDirectionLayers, VisualizationDirection, MapAnimationLayers,
    VisualizationAnimation, MapAnimations, VisualizationFrameSequence, VisualizationFrame
} from '../models'

@injectable()
export class PetMapper implements IPetMapper {

    mapIndex(indexObject: IndexRootObject, map: MapRootObject) {
        const { object } = indexObject
        const { logic, type, visualization } = object

        Object.assign(map, {
            type: logic,
            name: type,
            visualizationType: visualization,
            spritesheet: `${type}_spritesheet.json`
        })

        return this
    }

    mapLogic(logicObject: LogicRootObject, map: MapRootObject) {
        const { objectData } = logicObject
        const { model } = objectData
        const { dimensions, directions: logicDirections } = model
        const { direction: directionsArray } = logicDirections

        let x = Number(dimensions.x)
        let y = Number(dimensions.x)
        let z = parseFloat(dimensions.y)

        let directions: number[] = []

        directionsArray.map(direction => {

            let id = Number(direction.id)

            directions.push(id)

        })

        Object.assign(map, {
            dimensions: {
                x,
                y,
                z
            },
            directions
        })

        return this
    }

    mapAssets(assetsObject: AssetsRootObject, map: MapRootObject) {
        const { assets: assetsAssets } = assetsObject
        const { asset: assetsArray } = assetsAssets

        const assets: MapAssets = {} as const

        assetsArray.map(asset => {

            const { name, source, x, y, flipH, usesPalette } = asset

            assets[name] = { source, x, y, flipH, usesPalette }

        })

        Object.assign(map, {
            assets
        })

        return this
    }

    mapVisualizations(visualizationObject: VisualizationRootObject, map: MapRootObject) {
        const { visualizationData } = visualizationObject
        const { graphics } = visualizationData
        const { visualization: visualizationsArray } = graphics

        const sizes: ReadonlyArray<MapVisualizationSize> = [32, 64]

        let visualizations: MapVisualization[] = []

        sizes.map(size => {

            let visualization = visualizationsArray.find(visualization => {
                return Number(visualization.size) === size
            })

            const mapVisualization = this.mapVisualization(visualization, size)

            visualizations.push(mapVisualization)

        })

        Object.assign(map, {
            visualizations
        })

        return this
    }

    private mapVisualization(visualization: Visualization, size: MapVisualizationSize): MapVisualization {
        const mapVisualization: MapVisualization = {} as const

        this.mapVisualizationIndex(visualization, size, mapVisualization)
        this.mapVisualizationLayers(visualization, mapVisualization)
        this.mapVisualizationDirections(visualization, mapVisualization)
        this.mapVisualizationAnimations(visualization, mapVisualization)

        return mapVisualization
    }

    private mapVisualizationIndex(visualization: Visualization, size: MapVisualizationSize, mapVisualization: MapVisualization) {
        let layerCount = Number(visualization.layerCount)
        let angle = Number(visualization.angle)

        Object.assign(mapVisualization, {
            size,
            layerCount,
            angle
        })
    }

    private mapVisualizationLayers(visualization: Visualization, mapVisualization: MapVisualization) {
        const { layers: visualizationLayers } = visualization
        const { layer: layersArray } = visualizationLayers

        const layers: MapVisualizationLayers = {} as const

        layersArray.map(layer => {
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

        Object.assign(mapVisualization, {
            layers
        })
    }

    private mapVisualizationDirections(visualization: Visualization, mapVisualization: MapVisualization) {
        const { directions: visualizationDirections } = visualization
        const { direction: directionsArray } = visualizationDirections

        const directions: MapDirections = {} as const

        directionsArray.map(direction => {
            let id = Number(direction.id)

            const layers: MapDirectionLayers = {} as const

            this.mapVisualizationDirectionLayers(direction, layers)

            directions[id] = {
                layers
            }
        })

        Object.assign(mapVisualization, {
            directions
        })
    }

    private mapVisualizationDirectionLayers(direction: VisualizationDirection, layers: MapDirectionLayers) {
        const { layer: directionLayers } = direction

        directionLayers.map(layer => {
            let id = Number(layer.id)
            let z = Number(layer.id)

            layers[id] = {
                z
            }
        })
    }

    private mapVisualizationAnimations(visualization: Visualization, mapVisualization: MapVisualization) {
        const { animations: visualizationAnimations } = visualization
        const { animation: animationsArray } = visualizationAnimations

        const animations: MapAnimations = {} as const

        animationsArray.map(animation => {

            let id = Number(animation.id)

            const layers: MapAnimationLayers = {} as const

            this.mapVisualizationAnimationLayers(animation, layers)

            animations[id] = layers

        })

        Object.assign(mapVisualization, {
            animations
        })
    }

    private mapVisualizationAnimationLayers(animation: VisualizationAnimation, layers: MapAnimationLayers) {
        const { animationLayer: animationLayers } = animation

        if (animationLayers && animationLayers.length > 0) {

            animationLayers.map(layer => {
                const { frameSequence } = layer

                let frames: number[] = []

                if (frameSequence) {
                    this.mapVisualizationAnimationLayerFrames(frameSequence, frames)
                }

                let loopCount = Number(layer.loopCount) || undefined
                let frameRepeat = Number(layer.frameRepeat) || undefined

                let id = Number(layer.id)

                layers[id] = {
                    frames,
                    loopCount,
                    frameRepeat
                }
            })
        }
    }

    private mapVisualizationAnimationLayerFrames(frameSequence: VisualizationFrameSequence, mapFrames: number[]) {
        let frames = frameSequence.frame as VisualizationFrame[]

        if (frames && frames.length > 0) {
            frames.map(frame => {

                let id = Number(frame.id)

                mapFrames.push(id)

            })
        }

        let frame = frameSequence.frame as VisualizationFrame
        let id = Number(frame.id)

        if (frame) {
            mapFrames.push(id)
        }
    }
}