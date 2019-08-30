import { container, Types } from './injectors'

import { IPetUtility, IPetDownloader } from './interfaces'

let utility = container.get<IPetUtility>(Types.IPetUtility)
let downloader = container.get<IPetDownloader>(Types.IPetDownloader)

utility.main(downloader)