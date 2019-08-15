import Phaser, { GameObjects, Geom } from 'phaser'

import VisualizationRootObject, { Visualization, Animation, Direction, Layer2 } from './visualization'
import AssetsRootObject, { Custompart } from './assets'

import Room from '../room'
import RoomObjectDepth from '../depth'

const FPS = 24 as const
const FPS_TIME_MS = 60 / FPS
export const DEFAULT_SIZE = 64

type Size = 64 | 32 | 1

enum Directions {
    BEHIND_RIGHT,
    RIGHT,
    FRONT_RIGHT,
    FRONT,
    FRONT_LEFT,
    LEFT,
    BEHIND_LEFT,
    BEHIND
}

enum CatLayers {
    BODY,
    HEAD,
    TAIL,
    EMOTICON
}

export default class RoomPet extends GameObjects.Container {

    private visualizationData: VisualizationRootObject
    private visualization: Visualization
    private assets: AssetsRootObject

    private directions: number[]

    private totalTimeRunning: number = 0
    private frameCount: number = 0

    public constructor(public readonly scene: Room, public readonly type: string, private readonly size: Size,
        coordinates: Phaser.Math.Vector3, private direction: number, private readonly animation: number) {

        super(scene, coordinates.x, coordinates.y - coordinates.z)

        this.scene = scene
        this.type = type
        this.size = size
        this.direction = direction
        this.animation = animation

        this.setDepth(RoomObjectDepth.FIGURE)

        // Flipped directions
        // switch (this.direction) {

        //     case Directions.FRONT_LEFT:
        //         this.direction = Directions.FRONT_RIGHT
        //         this.scaleX = -1
        //         break

        //     case Directions.LEFT:
        //         this.direction = Directions.RIGHT
        //         this.scaleX = -1
        //         break

        //     case Directions.BEHIND_LEFT:
        //         this.direction = Directions.BEHIND_RIGHT
        //         this.scaleX = -1
        //         break
        // }

        this.load()
    }

    private load(): void {
        const { load } = this.scene

        load.setPath(`web-gallery/pets/${this.type}`)

        load.atlas(this.type, `${this.type}.png`, `${this.type}_spritesheet.json`)
        load.json(`${this.type}_visualization`, `${this.type}_visualization.json`)
        load.json(`${this.type}_assets`, `${this.type}_assets.json`)

        load.start()

        load.once('complete', () => {
            this.create()
        })
    }

    private create(): void {
        const { cache, time } = this.scene

        this.visualizationData = cache.json.get(`${this.type}_visualization`)

        console.log(this.visualizationData)

        this.visualization = this.visualizationData.visualizationData.graphics.visualization
            .find(visualization => Number(visualization.size) === this.size)

        console.log({ visualization: this.visualization }, this.type)

        this.assets = cache.json.get(`${this.type}_assets`)

        this.directions = this.getDirections()

        if (!this.hasDirection(this.direction)) {
            this.direction = this.directions[0]
        }

        time.addEvent({
            delay: 0,
            callback: this.update,
            callbackScope: this,
            loop: true
        })

        console.log({ assets: this.assets }, this.type)
        console.log({ postures: this.visualization.postures.posture }, this.type)
        console.log({ gestures: this.visualization.gestures.gesture }, this.type)
        console.log({ directions: this.directions }, this.type)
        console.log({ layerCount: this.getLayerCount() }, this.type)
    }

    private getDirections(): number[] {
        if (this.visualization.directions !== undefined) {
            let stringDirections = Object.keys(this.visualization.directions.direction)
            let numberDirections = stringDirections.map(stringDirection => Number(stringDirection))

            return numberDirections
        }

        return [0]
    }

    private hasDirection(direction: number): boolean {
        return this.directions.indexOf(direction) >= 0
    }

    public update(): void {
        this.totalTimeRunning++

        let frameCount = Math.round(this.totalTimeRunning / FPS_TIME_MS)

        if (this.frameCount != frameCount) {

            this.frameCount = frameCount

            this.updateView()

        }
    }

    private updateView(): void {
        this.removeAll()

        var layers: GameObjects.Sprite[] = []

        for (var layer = 0; layer < this.getLayerCount(); layer++) {
            let frame = this.getFrame(this.animation, layer, this.frameCount)
            let frameOffset = this.getFrameOffset(this.animation, layer, frame[1], this.direction)

            let customPart = this.getCustomPart('saddle')

            let layerSprite = this.getSprite(this.size, false, layer, this.direction, frame[0], customPart, frameOffset)

            if (layerSprite !== undefined) {

                let depthIndex = this.getDepthIndex(layerSprite)

                layerSprite.setDepth(depthIndex)

                layers.push(layerSprite)
            }
        }

        const shadowLayer = this.getSprite(this.size, true)

        if (shadowLayer !== undefined) {
            layers.push(shadowLayer)
        }

        let sortedLayers = layers.sort((a: GameObjects.Sprite, b: GameObjects.Sprite) => {
            return a.depth > b.depth ? 1 : -1
        })

        this.add(sortedLayers)
    }

    private getLayerCount(): number {
        return Number(this.visualization.layerCount)
    }

    private getFrame(animation: number, layer: number, frameCount: number): number[] {
        if (this.hasLayerForAnimation(animation, layer)) {
            let animationLayer = this.visualization.animations.animation[animation].animationLayer[layer]

            if (animationLayer.frameSequence === undefined) {
                return [0, 0]
            }

            if (animationLayer.frameSequence.frame.length === undefined) {
                return animationLayer.frameSequence.frame.id
            }

            let frameRepeat = Number(animationLayer.frameRepeat) || 1

            let frameIndex = Math.floor((frameCount % (animationLayer.frameSequence.frame.length * frameRepeat) / frameRepeat))

            return [Number(animationLayer.frameSequence.frame[frameIndex].id), frameIndex]
        }

        return [0, 0]
    }

    private getFrameOffset(animation: number, layer: number, frameId: number, direction: number): Geom.Point {
        if (this.hasLayerForAnimation(animation, layer)) {
            let animationLayer = this.visualization.animations.animation[animation].animationLayer[layer]

            if (animationLayer.frameSequence === undefined) {
                return new Geom.Point(0, 0)
            }

            let frame = animationLayer.frameSequence.frame[frameId]

            if (frame === undefined) {
                frame = animationLayer.frameSequence.frame
            }

            if (frame.offsets === undefined) {
                return new Geom.Point(0, 0)
            }

            let offset = frame.offsets.offset[direction]

            if (offset.x === undefined && offset.y === undefined) {
                return new Geom.Point(0, 0)
            }

            return new Geom.Point(Number(offset.x), Number(offset.y))
        }

        return new Geom.Point(0, 0)
    }

    private hasLayerForAnimation(animation: number, layer: number): boolean {
        return this.hasAnimation(animation) && this.visualization.animations.animation[animation].animationLayer[layer] !== undefined
    }

    private hasAnimation(animation: number): boolean {
        return this.hasAnimations() && this.visualization.animations.animation[animation] !== undefined
    }

    private hasAnimations(): boolean {
        return this.visualization.animations.animation !== undefined
    }

    private getCustomPart(partType: string, partId?: number): Custompart {
        if (this.assets.custompart !== undefined) {

            return this.assets.custompart.find(custompart => {
                let source = this.type + '_' + partType

                if (partId !== undefined) {
                    source += '_' + partId
                }

                return custompart.source == source
            })

        }

        return undefined
    }

    private getSprite(size: number, shadow: boolean, layer?: number, direction?: number, frame?: number, customPart?: Custompart, offset?: Geom.Point): GameObjects.Sprite {
        let assetName = shadow ? this.getAssetName(size, -1, 0, 0) : this.getAssetName(size, layer, direction, frame, customPart)

        if (this.hasAsset(assetName)) {
            let asset = this.getAssetFromAssets(assetName)
            let sourceName = assetName

            if (asset.source !== undefined) {
                sourceName = asset.source
            }

            try {
                const frameName = this.type + '_' + sourceName

                if (!this.spriteFrameExists(frameName)) {
                    return undefined
                }

                if (offset === undefined) {
                    offset = new Geom.Point(0, 0)
                }

                let layerSprite = new GameObjects.Sprite(this.scene, -Number(asset.x), -Number(asset.y), this.type, frameName).setOrigin(0, 0)

                if (this.direction > Directions.FRONT && this.direction < Directions.BEHIND) {
                    layerSprite.x -= offset.x
                }

                else {
                    layerSprite.x += offset.x
                }

                layerSprite.y += offset.y

                if (asset.flipH) {
                    layerSprite.scaleX = -1
                    layerSprite.x *= -1
                }

                if (asset.usesPalette) {
                    layerSprite.tint = 0xFF0000
                }

                if (layerSprite.frame.name !== frameName) {
                    return undefined
                }

                if (shadow) {
                    layerSprite.alpha = 0.1
                }

                return layerSprite
            }

            catch {
                return undefined
            }
        }

        return undefined
    }

    private getAssetName(size: number, layer: number, direction: number, frame: number, customPart?: Custompart) {
        let layerChar = this.getLayerCharFromNumber(layer)
        let assetName = this.type + '_' + size + '_' + layerChar

        if (direction !== undefined && frame !== undefined) {
            assetName += '_' + direction + '_' + frame
        }

        // if (customPart !== undefined) {
        //     assetName += '_' + customPart.id
        // }

        return assetName
    }

    private getLayerCharFromNumber(layer: number) {
        // sd = shadow
        return layer === -1 ? 'sd' : String.fromCharCode(layer + 97)
    }

    private hasAsset(assetName: string): boolean {
        let asset = this.getAssetFromAssets(assetName)

        if (asset !== undefined) {
            return asset.name === assetName
        }

        return false
    }

    private getAssetFromAssets(assetName: string): any {
        return this.assets.asset.find(asset => asset.name === assetName)
    }

    private spriteFrameExists(frameName: string): boolean {
        const { textures } = this.scene

        const texture = textures.get(this.type)
        const frames = Object.keys(texture.frames)

        return frames.find(frame => frame === frameName) !== undefined
    }

    private getDepthIndex(sprite: GameObjects.Sprite): number {
        const { frame, z } = sprite
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

        let fragments = frame.name.split('_')
        let layer = fragments[fragments.length - 3]

        return alphabet.indexOf(layer) + z
    }
}