import Chat from "./Chat";
import Room from "../Room";
import { Container, Sprite } from "pixi.js";
import BobbaEnvironment from "../../BobbaEnvironment";
import MainEngine from "../../graphics/MainEngine";

export default class ChatManager {
    _virtualId: number;
    chats: { [id: number]: Chat };
    room: Room;
    container: Container;
    _chatRollerCounter: number;
    _needsRoll: boolean;

    constructor(room: Room) {
        this.chats = {};
        this.room = room;
        this.container = new Container();
        this._chatRollerCounter = 0;
        this._needsRoll = false;
        this._virtualId = 0;
    }

    rollChats(amount: number) {
        for (let key in this.chats) {
            let chat: Chat = this.chats[key];
            if(chat == null)
                continue;
            chat.targetY -= (23 * amount);
        }
        this._chatRollerCounter = 0;
        this._needsRoll = false;
    }

    addChat(userId: number, message: string) {
        const roomUser = this.room.roomUserManager.getUser(userId);
        if (roomUser != null) {
            const image = BobbaEnvironment.getGame().chatImager.generateChatBubble(0, roomUser.user.name, message, roomUser.avatarContainer.color, roomUser.avatarContainer.headImage);
            const sprite = new Sprite(BobbaEnvironment.getGame().engine.getTextureFromImage(image));
            sprite.interactive = true;
            sprite.on('click', () => { roomUser.handleClick(0) });
            sprite.on('tap', () => { roomUser.handleClick(0) });
            sprite.cursor = 'pointer';

            roomUser.speak(1.5);

            sprite.x = Math.floor(roomUser.getSpriteX() - (sprite.width / 2) + 22);
            sprite.y = 150;
            if (this._needsRoll) {
                this.rollChats(1);
            }
            
            const id = this._virtualId++;
            this.chats[id] = new Chat(id, message, roomUser, sprite);
            this.container.addChild(sprite);
            this._needsRoll = true;
        }
    }

    tick(delta: number) {
        this._chatRollerCounter += delta;
        if (this._chatRollerCounter > ROLL_PERIOD) {
            this.rollChats(Math.round(this._chatRollerCounter / ROLL_PERIOD));
            this._chatRollerCounter = 0;
        }

        for (let key in this.chats) {
            let chat: Chat = this.chats[key];
            if(chat == null)
                continue;
            chat.move(delta);
            if(chat.targetY < -22) {
                this.container.removeChild(chat.sprite);
                delete (this.chats[chat.id]);
            }
        }
    }
}

const ROLL_PERIOD = 5000;