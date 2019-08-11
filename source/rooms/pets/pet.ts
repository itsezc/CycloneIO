import Phaser, { GameObjects, Geom } from 'phaser'

import VisualizationRootObject, { Visualization, Animation, Direction, Layer2 } from './visualization'
import AssetsRootObject from './assets'

import Room from '../room'
import RoomObjectDepth from '../depth'

const FPS = 24 as const
const FPS_TIME_MS = 60 / FPS
const DEFAULT_SIZE = 64 as const

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

export default class RoomPet extends GameObjects.Container {

    private visualizationData: VisualizationRootObject
    private visualization: Visualization
    private assets: AssetsRootObject

    private totalTimeRunning: number = 0
    private frameCount: number = 0

    public constructor(public readonly scene: Room, public readonly type: string, private readonly coordinates: Phaser.Math.Vector3,
        private direction: number, private readonly animation: number) {

        super(scene, coordinates.x, coordinates.y - coordinates.z)

        this.scene = scene
        this.type = type
        this.coordinates = coordinates
        this.direction = direction
        this.animation = animation

        this.setDepth(RoomObjectDepth.FIGURE)

        // Flipped directions
        switch (this.direction) {

            case Directions.FRONT_LEFT:
                this.direction = Directions.FRONT_RIGHT
                this.scaleX = -1
                break

            case Directions.LEFT:
                this.direction = Directions.RIGHT
                this.scaleX = -1
                break

            case Directions.BEHIND_LEFT:
                this.direction = Directions.BEHIND_RIGHT
                this.scaleX = -1
                break
        }

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
        this.visualization = this.visualizationData.visualizationData.graphics.visualization[1]

        this.assets = cache.json.get(`${this.type}_assets`)

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
        console.log({ visualization: this.visualization }, this.type)
        console.log({ postures: this.visualization.postures.posture }, this.type)
        console.log({ gestures: this.visualization.gestures.gesture }, this.type)
    }

    private get directions(): number[] {
        let stringDirections = Object.keys(this.visualization.directions.direction)
        let numberDirections = stringDirections.map(stringDirection => Number(stringDirection))

        return numberDirections
    }

    private get layerCount(): number {
        return Number(this.visualization.layerCount)
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

        for (let layerId = 0; layerId < this.layerCount; layerId++) {
            let frameIndex = this.getFrameIndex(this.animation, layerId, this.frameCount)
            let frameOffsets = this.getFrameOffsetsFromDirection(this.animation, layerId, frameIndex, this.direction)

            let layerSprite = this.getSprite(DEFAULT_SIZE, false, layerId, this.direction, frameIndex, frameOffsets)

            if (layerSprite !== undefined) {

                this.updateSpriteFromDirection(layerSprite, this.direction, layerId)

                let depthIndex = this.getDepthIndex(layerSprite)

                layerSprite.setDepth(depthIndex)

                layers.push(layerSprite)
            }
        }

        const shadowLayer = this.getSprite(DEFAULT_SIZE, true)

        if (shadowLayer !== undefined) {
            layers.push(shadowLayer)
        }

        let sortedLayers = layers.sort(this.compareLayersDepth).filter(this.isCorrectSpriteSize)

        this.add(sortedLayers)
    }

    private getFrameIndex(animation: number, layer: number, frameCount: number): number {

        if (this.hasAnimationForLayer(animation, layer)) {

            let animationLayer = this.getAnimationLayer(animation, layer)
            let frame = this.getFrame(animation, layer)

            if (frame.length === undefined) {
                return 0
            }

            let frameRepeat = Number(animationLayer.frameRepeat) || 1
            let frameLoop = Number(animationLayer.frameLoop) || 0

            let frameIndex = Math.floor(((frameCount % (frame.length * frameRepeat) / frameRepeat) ))

            frame = this.getFrame(animation, layer, frameIndex)

            if (this.hasAssetName(layer, this.direction, frame.id)) {
                return Number(frame.id)
            }

            return 0
        }

        return 0
    }

    private hasAnimationForLayer(animation: number, layer: number): boolean {
        return this.hasAnimation(animation) && this.getAnimationLayer(animation, layer) !== undefined
    }

    private hasAnimationFrameOffset(animation: number, layer: number, frameIndex: number, direction: number): boolean {
        let offsets = this.getAnimationFrameOffsets(animation, layer, frameIndex)

        if (offsets === undefined) {
            return false
        }

        let offset = this.getAnimationFrameOffset(animation, layer, frameIndex, direction)

        return offset.x !== undefined && offset.y !== undefined
    }

    private hasAnimation(animation: number): boolean {
        return this.hasAnimations && this.getAnimation(animation) !== undefined
    }

    private getAnimationLayer(animationId: number, layer: number): any {
        return this.visualization.animations.animation[animationId].animationLayer[layer]
    }

    private getFrame(animation: number, layer: number, frameIndex?: number) {
        let frame = this.getAnimationLayer(animation, layer).frameSequence.frame

        return frame[frameIndex] === undefined ? frame : frame[frameIndex]
    }

    private getAnimationFrameOffsets(animation: number, layer: number, frameIndex: number): any {
        return this.getFrame(animation, layer, frameIndex).offsets
    }

    private getAnimationFrameOffset(animation: number, layer: number, frameIndex: number, direction: number): any {
        return this.getAnimationFrameOffsets(animation, layer, frameIndex).offset[direction]
    }

    private get hasAnimations(): boolean {
        return this.visualization.animations.animation !== undefined
    }

    private getAnimation(animation: number): Animation {
        return this.visualization.animations.animation[animation]
    }

    private getFrameOffsetsFromDirection(animation: number, layer: number, frameIndex: number, direction: number): Geom.Point {

        if (this.hasAnimationForLayer(animation, layer) && this.hasAnimationFrameOffset(animation, layer, frameIndex, direction)) {

            const { x, y } = this.getAnimationFrameOffset(animation, layer, frameIndex, direction)

            return new Geom.Point(Number(x), Number(y))
        }
    }

    private getSprite(size: number, shadow: boolean, layer?: number, direction?: number, frame?: number, offsets?: Geom.Point): GameObjects.Sprite {
        let assetName = shadow ? this.getAssetName(size, -1, 0, 0) : this.getAssetName(size, layer, direction, frame)

        if (this.hasAsset(assetName)) {
            let asset = this.getAsset(assetName)

            const frameName = this.type + '_' + assetName
            const { x, y } = asset

            if (!this.spriteFrameExists(frameName)) {
                return undefined
            }

            if (offsets === undefined) {
                offsets = new Geom.Point(0, 0)
            }

            let layerSprite = new GameObjects.Sprite(this.scene, -Number(x) + offsets.x, -Number(y) + offsets.y, this.type, frameName)

            layerSprite.setOrigin(0, 0)

            layerSprite.setTint(0xE478CF, 0x9947B3, 0xCB303C, 0x1896D5)

            if (layerSprite.frame.name !== frameName) {
                return undefined
            }

            if (shadow) {
                layerSprite.alpha = 0.1
            }

            return layerSprite
        }

        return undefined
    }

    private getAssetName(size: number, layer: number, direction?: number, frame?: number): string {
        let layerChar = this.getLayerCharFromNumber(layer)
        let assetName = this.type + '_' + size + '_' + layerChar

        if (direction !== undefined && frame !== undefined) {
            assetName += '_' + direction + '_' + frame
        }

        return assetName
    }

    private getLayerCharFromNumber(layer: number) {
        // sd = shadow
        return layer === -1 ? 'sd' : String.fromCharCode(layer + 97)
    }

    private hasAsset(assetName: string): boolean {
        let asset = this.getAsset(assetName)

        if (asset !== undefined) {
            return asset.name === assetName
        }

        return false
    }

    private hasAssetName(layer: number, direction: number, frame: number): boolean {
        const { textures } = this.scene

        const texture = textures.get(this.type)

        let assetName = this.getAssetName(DEFAULT_SIZE, layer, direction, frame)
        let spriteName = this.type + '_' + assetName

        return texture.has(spriteName)
    }

    private getAsset(assetName: string): any {
        return this.assets.asset.find(asset => asset.name === assetName)
    }

    private spriteFrameExists(frameName: string): boolean {
        const { textures } = this.scene

        const texture = textures.get(this.type)
        const frames = Object.keys(texture.frames)

        return frames.find(frame => frame === frameName) !== undefined
    }

    private updateSpriteFromDirection(sprite: GameObjects.Sprite, direction: number, layer: number): void {
        if (this.hasVisualDirectionLayer(direction, layer)) {

            let visualDirectionLayer = this.getVisualDirectionLayer(direction, layer)

            this.doUpdateSprite(sprite, visualDirectionLayer)

        }
    }

    private hasVisualDirectionLayer(direction: number, layer: number): boolean {
        return this.hasVisualDirection(direction) && this.getVisualDirection(direction).layer[layer] !== undefined
    }

    private hasVisualDirection(direction: number): boolean {
        return this.hasVisualDirections && this.getVisualDirection(direction) !== undefined
    }

    private hasVisualDirections(): boolean {
        return this.visualization.directions !== undefined
    }

    private getVisualDirection(direction: number): Direction {
        return this.visualization.directions.direction[direction]
    }

    private getVisualDirectionLayer(direction: number, layer: number) {
        return this.getVisualDirection(direction).layer[layer]
    }

    private doUpdateSprite(sprite: GameObjects.Sprite, visualDirectionLayer: Layer2) {
        const { z } = visualDirectionLayer

        sprite.z += Number(z) || 0
    }

    private getDepthIndex(sprite: GameObjects.Sprite): number {
        const { frame, z } = sprite
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

        let fragments = frame.name.split('_')
        let layer = fragments[fragments.length - 3]

        return alphabet.indexOf(layer) + z
    }

    private isCorrectSpriteSize(sprite: GameObjects.Sprite): boolean {
        const { frame } = sprite

        let fragments = frame.name.split('_')
        let size = Number(fragments[fragments.length - 4])

        return size === DEFAULT_SIZE
    }

    private compareLayersDepth(a: GameObjects.Sprite, b: GameObjects.Sprite): number {
        return a.depth > b.depth ? 1 : -1
    }
}