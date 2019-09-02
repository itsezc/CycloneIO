import { injectable } from 'inversify'
import { Viewport } from 'pixi-viewport'
import * as PIXI from 'pixi.js-legacy'

import ICullManager from './ICullManager'

@injectable()
export default class CullManager implements ICullManager {
	private viewport: Viewport
	private padding: number = 300
	private timesTriggered: number = 0

	public setViewport(viewport: Viewport): void {
		this.viewport = viewport

		this.bindEvents()
	}

	private bindEvents(): void {
		this.viewport.on('moved', (): void => this.handleMove())
	}

	public handleMove(): void {
		if (this.timesTriggered === 2) {
			this.recursiveCheck(this.viewport.children)

			this.timesTriggered = 0
		} else {
			++this.timesTriggered
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private recursiveCheck(children: any[]): void {
		for (const child of children) {
			if (child instanceof PIXI.Sprite) {
				child.renderable = !this.isOffScreen(child)
			} else {
				if (child.children) {
					this.recursiveCheck(child.children)
				}
			}
		}
	}

	private isOffScreen(object: PIXI.DisplayObject): boolean {
		const objectBounds = object.getBounds()
		const objectPosition = object.getGlobalPosition()

		const isOffScreenLeft = (objectPosition.x + objectBounds.width) < -this.padding
		const isOffScreenRight = objectPosition.x > (window.innerWidth + this.padding)
		const isOffScreenTop = (objectPosition.y + objectBounds.height) < -this.padding
		const isOffScreenBottom = objectPosition.y > (window.innerHeight + this.padding)

		return isOffScreenLeft || isOffScreenRight || isOffScreenTop || isOffScreenBottom
	}
}