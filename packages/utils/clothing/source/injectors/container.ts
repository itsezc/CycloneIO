import 'reflect-metadata'

import { Container } from 'inversify'

import ClothingExtractor from '../extractor'

import { IClothingParser, IClothingGenerator } from '../interfaces'
import { ClothingParser, ClothingGenerator } from '../entities'

const container = new Container()

container.bind<ClothingExtractor>(ClothingExtractor).toSelf().inSingletonScope()
container.bind<IClothingParser>(ClothingParser).to(ClothingParser).inSingletonScope()
container.bind<IClothingGenerator>(ClothingGenerator).to(ClothingGenerator).inSingletonScope()

export default container