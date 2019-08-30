export interface IPetDownloader {
    downloadSWF(asset: string): Promise<Buffer>
}