import 'reflect-metadata'

import { Container } from 'inversify'

import { Types } from './types'

import { IPetUtility, IPetDownloader, IPetExtractor, IPetConverter, IPetMapper } from '../interfaces'
import { PetUtility, PetDownloader, PetExtractor, PetConverter, PetMapper } from '../entities'

export const container = new Container()

container.bind<IPetUtility>(Types.IPetUtility).to(PetUtility).inSingletonScope()
container.bind<IPetDownloader>(Types.IPetDownloader).to(PetDownloader).inSingletonScope()
container.bind<IPetExtractor>(Types.IPetExtractor).to(PetExtractor).inSingletonScope()
container.bind<IPetConverter>(Types.IPetConverter).to(PetConverter).inSingletonScope()
container.bind<IPetMapper>(Types.IPetMapper).to(PetMapper).inSingletonScope()