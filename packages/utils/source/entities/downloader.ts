import { injectable } from 'inversify';

import { IPetDownloader } from '../interfaces'

import { flashClientURL, SWFProduction } from '../../config.json'

import Download from 'download'

@injectable()
export class PetDownloader implements IPetDownloader {
    async downloadSWF(asset: string) {
        return Download(`${flashClientURL}/${SWFProduction}/${asset}.swf`)
    }
}