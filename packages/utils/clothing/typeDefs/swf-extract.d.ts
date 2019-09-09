

    export type SWF = {
        tags: Tag[],
        version: number,
        fileLength: FileLength
        frameSize: FrameSize,
        frameRate: number,
        frameCount: number
    }

    export type Tag = {
        code: number,
        length: number,
        rawData: Buffer
    }

    type FileLength = {
        compressed: number,
        uncompressed: number
    }

    type FrameSize = {
        x: number,
        y: number,
        width: number,
        height: number
    }

    export type Image = {
        code: number,
        characterId: number,
        imgType: string,
        imgData: Buffer
    }

declare module 'swf-extract' {
    export function readFromBufferP(rawData: Buffer): Promise<SWF>
    export function extractImages(tags: Tag[]): Iterable<Image>
}