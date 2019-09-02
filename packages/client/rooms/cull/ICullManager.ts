import { Viewport } from 'pixi-viewport'

export default interface ICullManager {
	setViewport(viewport: Viewport): void

	handleMove(): void
}