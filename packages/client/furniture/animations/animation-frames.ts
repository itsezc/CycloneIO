export type AnimationFrame = {
    frameId: number,
    nextPosition: {
        x: number,
        y: number
    },
    effect?: Function;
}