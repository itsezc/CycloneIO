import PartType from './partType';
import BodyLocation from './bodyLocation';

export default class PartTypes {

    static readonly SHOES = new PartType("sh", BodyLocation.BODY, 5);
    static readonly LEGS = new PartType("lg", BodyLocation.BODY, 6);
    static readonly CHEST = new PartType("ch", BodyLocation.BODY, 7);
    static readonly WAIST = new PartType("wa", BodyLocation.BODY, 8);
    static readonly CHEST_ACCESSORY = new PartType("ca", BodyLocation.BODY, 9);
    static readonly FACE_ACCESSORY = new PartType("fa", BodyLocation.HEAD, 27);
    static readonly EYE_ACCESSORY = new PartType("ea", BodyLocation.HEAD, 28);
    static readonly HEAD_ACCESSORY = new PartType("ha", BodyLocation.HEAD, 29);
    static readonly HEAD_EXTRA = new PartType("he", BodyLocation.HEAD, 20);
    static readonly CHEST_COVER = new PartType("cc", BodyLocation.BODY, 21);
    static readonly CHEST_PIECE = new PartType("cp", BodyLocation.BODY, 6);
    static readonly HEAD = new PartType("hd", BodyLocation.HEAD, 22);
    static readonly BODY = new PartType("bd", BodyLocation.BODY, 1, PartTypes.HEAD);
    static readonly FACIAL_CONTOURS = new PartType("fc", BodyLocation.HEAD, 23, PartTypes.HEAD);
    static readonly HAIR = new PartType("hr", BodyLocation.HEAD, 24);
    static readonly LEFT_ARM_LARGE = new PartType("lh", BodyLocation.BODY, 5, PartTypes.HEAD);
    static readonly LEFT_ARM_SMALL = new PartType("ls", BodyLocation.BODY, 6, PartTypes.CHEST);
    static readonly RIGHT_ARM_LARGE = new PartType("rh", BodyLocation.BODY, 10, PartTypes.HEAD);
    static readonly RIGHT_ARM_SMALL = new PartType("rs", BodyLocation.BODY, 11, PartTypes.CHEST);
    static readonly EYE = new PartType("ey", BodyLocation.HEAD, 24);
    static readonly LEFT_HAND_ITEM = new PartType("li", BodyLocation.BODY, 0);
    static readonly HAIR_BACK = new PartType("hrb", BodyLocation.HEAD, 26, PartTypes.HAIR);
    static readonly RIGHT_HAND_ITEM = new PartType("ri", BodyLocation.BODY, 26);
    static readonly LEFT_ARM_CARRY = new PartType("lc", BodyLocation.BODY, 23, PartTypes.HEAD);
    static readonly RIGHT_ARM_CARRY = new PartType("rc", BodyLocation.BODY, 24, PartTypes.HEAD);
    static readonly EFFECT = new PartType("fx", BodyLocation.BODY, 100);

    private static readonly list: PartType[] = [PartTypes.SHOES, PartTypes.LEGS, PartTypes.CHEST, PartTypes.WAIST,
        PartTypes.CHEST_ACCESSORY, PartTypes.FACE_ACCESSORY, PartTypes.HEAD_ACCESSORY, PartTypes.HEAD_EXTRA, PartTypes.CHEST_COVER, PartTypes.CHEST_PIECE,
        PartTypes.HEAD, PartTypes.BODY, PartTypes.FACIAL_CONTOURS, PartTypes.HAIR, PartTypes.LEFT_ARM_LARGE, PartTypes.LEFT_ARM_SMALL, PartTypes.RIGHT_ARM_LARGE,
        PartTypes.EYE, PartTypes.RIGHT_HAND_ITEM, PartTypes.LEFT_ARM_CARRY, PartTypes.RIGHT_ARM_CARRY, PartTypes.EFFECT];

    constructor(){
        //PartTypes.LEFT_ARM_SMALL.rotation_offset[3] = 1
    }

    public static fromKey(key: String): PartType {
        return PartTypes.list.find(part => part.getKey() == key);
    }

}