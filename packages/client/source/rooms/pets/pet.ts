import Phaser, { GameObjects, Geom } from 'phaser'

import VisualizationRootObject, { Visualization, Layer2 } from '../../../../utils/source/pets/types/visualization'
import AssetsRootObject, { Custompart } from '../../../../utils/source/pets/types/assets'

import Room from '../room'
import RoomObjectDepth from '../depth'
import LogicRootObject, { Direction } from '../../../../utils/source/pets/types/logic'

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

enum HorseLayers {
    BODY,
    HEAD,
    TAIL,
    HAIR,
    SADDLE
}

type HorseCustompart = {
    saddle?: number,
    tail?: number
}

export default class RoomPet extends GameObjects.Container {

    private visualizationData: VisualizationRootObject
    private visualization: Visualization
    private assets: AssetsRootObject
    private logic: LogicRootObject

    private directions: Direction[]

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

        this.load()
    }

    private load(): void {
        const { load } = this.scene

        load.setPath(`pets/${this.type}`)

        load.atlas(this.type, `${this.type}.png`, `${this.type}_spritesheet.json`)
        load.json(`${this.type}_visualization`, `${this.type}_visualization.json`)
        load.json(`${this.type}_assets`, `${this.type}_assets.json`)
        load.json(`${this.type}_logic`, `${this.type}_logic.json`)

        load.start()

        load.once('complete', () => {
            this.create()
        })
    }

    private create(): void {
        const { cache, time } = this.scene

        this.visualizationData = cache.json.get(`${this.type}_visualization`)
        this.logic = cache.json.get(`${this.type}_logic`)

        console.log({ visualizationData: this.visualizationData }, this.type)
        console.log({ logic: this.logic }, this.type)

        this.visualization = this.visualizationData.visualizationData.graphics.visualization
            .find(visualization => Number(visualization.size) === this.size)

        console.log({ visualization: this.visualization }, { size: this.size }, this.type)

        this.assets = cache.json.get(`${this.type}_assets`)

        this.directions = this.logic.objectData.model.directions.direction || undefined

        if (!this.hasDirection(this.direction)) {
            this.direction = Number(this.directions[0].id) / 90 * 2
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

    private hasDirection(direction: number): boolean {
		return Number(this.directions[direction].id) / 90 * 2 >= 0;
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

            let customParts = this.getCustomParts({ saddle: 1 })

            let layerSprite = this.getSprite(this.size, false, layer, this.direction, frame[0], customParts, frameOffset)

            if (layerSprite !== undefined) {

                this.updateSpriteFromDirection(layerSprite, this.direction, layer)

                let depthIndex = this.getDepthIndex(layerSprite, this.direction)

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
                return [0]
            }

            if (animationLayer.frameSequence.frame.length === undefined) {
                return [Number(animationLayer.frameSequence.frame.id)]
            }

            let frameRepeat = Number(animationLayer.frameRepeat) || 1

            let frameIndex = Math.floor((frameCount % (animationLayer.frameSequence.frame.length * frameRepeat) / frameRepeat))

            return [Number(animationLayer.frameSequence.frame[frameIndex].id), frameIndex]
        }

        return [0]
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

    private getCustomParts(parts: HorseCustompart): Custompart[] {
        if (this.assets.assets.custompart !== undefined) {

            let customparts: Custompart[] = []

            if (parts.saddle !== undefined) {

                let part = this.assets.assets.custompart.find(customPart => {
                    let asset = this.type + '_' + 'saddle'

                    if (parts.saddle > 1) {
                        asset += parts.saddle
                    }

                    return customPart.source === asset
                })

                customparts.push(part)

            }

            if (parts.tail !== undefined) {

                let part = this.assets.assets.custompart.find(customPart => {
                    return parts.tail > 0 ? customPart.source === this.type + '_' + 'hair' + '_' + parts.tail : false
                })

                customparts.push(part)

            }

            return customparts

        }

        return undefined
    }

    private getSprite(size: number, shadow: boolean, layer?: number, direction?: number, frame?: number, customParts?: Custompart[], offset?: Geom.Point): GameObjects.Sprite {
        let assetName = shadow ? this.getAssetName(size, -1, 0, 0) : this.getAssetName(size, layer, direction, frame, customParts)

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

    private getAssetName(size: number, layer: number, direction: number, frame: number, customParts?: Custompart[]): string {
        let layerChar = this.getLayerCharFromNumber(layer)
        let assetName = this.type + '_' + size + '_' + layerChar

        if (direction !== undefined && frame !== undefined) {
            assetName += '_' + direction + '_' + frame
        }

        if (customParts !== undefined) {

            switch (layer) {

                case HorseLayers.TAIL: {
                    let customPart = customParts.find(value => {

                        if (value !== undefined) {
                            let tags = value.tags.split(',')

                            return tags.includes('tail')
                        }

                    })

                    if (customPart !== undefined) {
                        assetName += '_' + Number(customPart.id)
                    }

                    break
                }

                case HorseLayers.SADDLE: {

                    let customPart = customParts.find(value => {
                        if (value !== undefined) {
                            return value.tags === 'saddle'
                        }
                    })

                    if (customPart !== undefined) {
                        assetName += '_' + Number(customPart.id)
                    }

                    break
                }

            }

        }

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
        return this.assets.assets.asset.find(asset => asset.name === assetName)
    }

    private spriteFrameExists(frameName: string): boolean {
        const { textures } = this.scene

        const texture = textures.get(this.type)
        const frames = Object.keys(texture.frames)

        return frames.find(frame => frame === frameName) !== undefined
    }

    private updateSpriteFromDirection(sprite: GameObjects.Sprite, direction: number, layer: number) {
        if (this.hasLayerForVisualDirection(direction, layer)) {
            this.doUpdateSprite(sprite, this.visualization.directions.direction[direction].layer[layer])
        }
    }

    private hasLayerForVisualDirection(direction: number, layer: number) {
        return this.hasVisualDirection(direction) && this.visualization.directions.direction[direction].layer[layer] !== undefined
    }

    private hasVisualDirections() {
        return this.visualization.directions !== undefined
    }

    private hasVisualDirection(direction: number) {
        return this.hasVisualDirections() && this.visualization.directions.direction[direction] !== undefined
    }

    private doUpdateSprite(sprite: GameObjects.Sprite, layer: Layer2) {
        sprite.z += layer.z ? Number(layer.z) : 0
    }

    private getDepthIndex(sprite: GameObjects.Sprite, direction: number): number {
        const { frame } = sprite
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

        let fragments = frame.name.split('_')
        let layer = fragments[fragments.length - fragments.length > 6 ? 4 : 3]

        let depth = alphabet.indexOf(layer) + sprite.z

        // // 5 6 1
        // if (direction < Directions.BEHIND_LEFT && direction > Directions.FRONT_LEFT || direction === Directions.RIGHT) {
        //     depth -= sprite.z
        // }

        // // 7 4 3 0
        // else if (direction === Directions.BEHIND || direction > Directions.FRONT_RIGHT && direction < Directions.LEFT
        //     || direction === Directions.BEHIND_RIGHT) {
        //     depth += sprite.z
        // }

        return depth
    }
}