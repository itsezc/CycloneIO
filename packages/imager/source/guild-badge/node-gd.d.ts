declare module 'node-gd' {
    
    export function create(width: number, height: number, callback: (error: any) => void): void;

    export function createSync(width: number, height: number): Image;

    export function createTrueColor(width: number, height: number, callback: (error: any, image: Image) => void): void;

    export function createTrueColorSync(width: number, height: number): Image;

    export function openJpeg(path: string, callback: (error: any, image: Image) => void): void;
    export function createFromJpeg(path: string): any;
    export function createFromJpegPtr(data: string | Buffer): Image;

    export function openPng(path: string, callback: (error: any, image: Image) => void): void;
    export function createFromPng(path: string): Image;
    export function createFromPngPtr(data: string | Buffer): Image;

    export function openGif(path: string, callback: (error: any, image: Image) => void): Image;
    export function createFromGif(path: string): Image;
    export function createFromGifPtr(data: string | Buffer): Image;

    export function openGd2(path: string, callback: (error: any, image: Image) => void): void;
    export function createFromGd2(path: string): void;
    export function createFromGd2Ptr(data: string | Buffer): Image;
    
    


    export function trueColor(red: number, green: number, blue: number): number;

    export function trueColorAlpha(red: number, green: number, blue: number, alpha: number): number;

    export function getGDVersion(): string;



    export class Image {

        public height: number;
        public width: number;
        public colorTotals: number;

        public destroy(): void;

        public saveAlpha(alpha: number): void;

        public setPixel(x: number, y: number, color: number): void;

        public copy(baseImage: Image, srcX: number, srcY: number, destX: number, destY: number, width: number, height: number): void;

        public getPixel(x: number, y: number): number;

        public red(color: number): number;
        public green(color: number): number;
        public blue(color: number): number;
        public alpha(color: number): number;

        public colorAllocate(red: number, green: number, blue: number): number;
    }

}