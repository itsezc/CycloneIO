type AvatarDirection = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export enum Directions {
    BEHIND_RIGHT,
    RIGHT,
    FRONT_RIGHT,
    FRONT,
    FRONT_LEFT,
    LEFT,
    BEHIND_LEFT,
    BEHIND
}

export type AvatarPartsDirection = {
    head: AvatarDirection,
    body: AvatarDirection
}

export default AvatarDirection