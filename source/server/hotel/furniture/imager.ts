import fs from 'fs'
import Environment from '../../environment2'

interface FurnitureData {
	roomitemtypes: RoomItemType
};

interface RoomItemType {
	furnitype: FurniType[]
};

interface FurniType {
	id: number
	classname: string
}

export default class FurnitureImager {

	private async load(filename: string): Promise<any> {
		
		return new Promise<any>((resolve: any, reject: any) => {

			fs.readFile(filename, (error: any, data: any) => {
				
				if (error) {
					reject(error)
				}   
				
				console.log(JSON.parse(data))
				resolve(JSON.parse(data))
			})
		})
	}

	public async getFurniture(id: number): Promise<any> {

		return new Promise((resolve, reject) => {
			this.load('web-gallery/gamedata/furnidata.json').then((furnidata: any) => {

				let item: any = furnidata.roomitemtypes.furnitype.find((item: any) => {
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