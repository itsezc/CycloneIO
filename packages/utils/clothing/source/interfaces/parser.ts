export interface IClothingParser {
    parseFigureMap(figureMap: Buffer | string): Promise<{ name: string, rawData: Buffer }[]>
    parseRawBuffer(rawData: Buffer, symbols: string[]): void
}