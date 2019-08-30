import { SWF, Tag, Image } from 'swf-extract';

import { SWFBinaryData } from '../entities'

export interface IPetExtractor {
    extractSWF(data: Buffer): Promise<SWF>
    extractImages(tags: Tag[]): Promise<Image[]>
    extractSymbolTags(tags: readonly Tag[]): Tag[]
    extractSymbols(tags: readonly Tag[], asset: string): string[]
    extractBinaryDataTags(tags: readonly Tag[]): Tag[]
    extractBinaryData(tags: readonly Tag[]): SWFBinaryData
}