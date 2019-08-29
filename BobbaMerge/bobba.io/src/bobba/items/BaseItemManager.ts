import FurniImager, { ItemType } from "../imagers/furniture/FurniImager";
import BaseItem from "./BaseItem";
import BobbaEnvironment from "../BobbaEnvironment";

export default class BaseItemManager {
    furniImager: FurniImager;
    items: BaseItemDictionary;

    constructor(furniImager: FurniImager) {
        this.furniImager = furniImager;
        this.items = {};
    }

    async getItem(itemType: ItemType, itemId: number): Promise<BaseItem> {
        if (this.items[itemId] == null) {
            const base = await BobbaEnvironment.getGame().furniImager.loadItemBase(itemType, itemId);
            this.items[itemId] = new BaseItem(base);
        }
        return this.items[itemId];
    }

}

interface BaseItemDictionary {
    [id: number]: BaseItem;
}