import fs from 'fs'
import Environment from '../../../environment'

export default class FurnitureImager {

    constructor() {
        
    }

    async load(file) {
        
        return new Promise((resolve, reject) => {

            fs.readFile(file, (error, data) => {
                
                if (error) {
                    reject(error)
                }   
                
                resolve(JSON.parse(data))
            })
        })
    }

    async getFurniture(id) {

        return new Promise((resolve, reject) => {
            this.load('web-build/gamedata/furnidata.json').then((furnidata) => {

                let item = furnidata.roomitemtypes.furnitype.find(item => {
                    return id == item.id
                })

                if (item === undefined) {
                    reject(`Item ${id} not found`)
                }

                resolve(item)
            })
        })
    }
    //     await ItemImager.load('web-build/gamedata/furnidata.json').then((furnidata) => {

    //         return new Promise((resolve, reject) => {

    //             let item = furnidata.roomitemtypes.furnitype.find(item => {
    //                 return id == item.id
    //             })

    //             if (item === undefined) {
    //                 reject(`Item ${id} not found`)
    //             }

    //             resolve(item)

    //         }).catch(error => {
    //             Environment.instance.logger.error(error)
    //         })
    //     })
    //}
}