import container from './injectors/container'

import ClothingExtractor from './extractor'

container.get<ClothingExtractor>(ClothingExtractor).init()