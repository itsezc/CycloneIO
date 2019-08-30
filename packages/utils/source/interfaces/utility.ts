import { IPetDownloader } from './downloader'

export interface IPetUtility {
    main(downloader: IPetDownloader): void
}