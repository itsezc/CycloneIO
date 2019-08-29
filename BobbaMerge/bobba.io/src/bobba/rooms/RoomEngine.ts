import Room from "./Room";
import { Sprite, Container, Point, Texture } from "pixi.js";
import BobbaEnvironment from "../BobbaEnvironment";
import MainEngine from "../graphics/MainEngine";
import { ROOM_TILE_WIDTH, ROOM_TILE_HEIGHT, ROOM_SELECTED_TILE, ROOM_WALL_L_OFFSET_X, ROOM_WALL_L_OFFSET_Y, ROOM_WALL_R_OFFSET_X, ROOM_WALL_R_OFFSET_Y } from "../graphics/GenericSprites";
import RequestMovement from "../communication/outgoing/rooms/RequestMovement";
import FloorItem from "./items/FloorItem";
import RoomItem from "./items/RoomItem";
import { Direction } from "../imagers/furniture/FurniImager";

const CAMERA_CENTERED_OFFSET_X = 0;
const CAMERA_CENTERED_OFFSET_Y = 150;

const ROOM_SELECTED_TILE_OFFSET_X = 0;
const ROOM_SELECTED_TILE_OFFSET_Y = -3;

export default class RoomEngine {
    room: Room;
    container: Container;
    selectableContainer: Container;
    floorSprites: Sprite[];
    wallSprites: Sprite[];
    selectedTileSprite?: Sprite;
    lastMousePositionX: number;
    lastMousePositionY: number;
    userSprites: ContainerDictionary;
    shadowSprites: ContainerDictionary;
    roomItemSprites: ContainerArrayDictionary;
    selectableSprites: ContainerArrayDictionary;
    selectableItems: SelectableDictionary;
    currentSelectedItem?: Selectable | null;
    movingItem: RoomItem | null;
    movingItemPosition: { x: number, y: number, z: number, rot: Direction };
    cameraX: number;
    cameraY: number;
    maxHeight: number;
    wallPoints: { x: number, y: number, z: number, rot: Direction }[];

    constructor(room: Room) {
        this.room = room;
        this.container = new Container();
        this.selectableContainer = new Container();
        this.floorSprites = [];
        this.wallSprites = [];
        this.userSprites = {};
        this.shadowSprites = {};
        this.roomItemSprites = {};
        this.selectableSprites = {};
        this.selectableItems = {};
        this.lastMousePositionX = 0;
        this.lastMousePositionY = 0;
        this.cameraX = 0;
        this.cameraY = 0;
        
        this.wallPoints = [];
        this.maxHeight = 1;

        this.movingItem = null;
        this.movingItemPosition = { x: 0, y: 0, z: 0, rot: 0 };

        this.container.sortableChildren = true;
        this.selectableContainer.sortableChildren = true;
        this.onResize();
        this.setWalls();
        this.setFloor();
        this.setSelectedTile();
    }

    onResize() {
        this.centerCamera();
    }

    centerCamera() {
        const { model, roomUserManager } = this.room;
        const { currentUser } = BobbaEnvironment.getGame().userManager;
        const doorCoords = this.tileToLocal(model.doorX, model.doorY, 0);

        let centerPointX = doorCoords.x;
        let centerPointY = doorCoords.y;

        if (currentUser != null && roomUserManager != null) {
            const roomUser = roomUserManager.getUser(currentUser.id);
            if (roomUser != null) {
                const userCoords = this.tileToLocal(roomUser._x, roomUser._y, roomUser._z);
                centerPointX = userCoords.x;
                centerPointY = userCoords.y;
            }
        }

        this.cameraX = Math.round((MainEngine.getViewportWidth() - (centerPointX + CAMERA_CENTERED_OFFSET_X)) / 2);
        this.cameraY = Math.round((MainEngine.getViewportHeight() - (centerPointY + CAMERA_CENTERED_OFFSET_Y)) / 2);
    }

    followCamera(delta: number) {

        delta = delta / 1000;

        let targetX = this.cameraX;
        let targetY = this.cameraY;

        let newX = this.container.x;
        let newY = this.container.y;

        let DistanceX = Math.abs(targetX - newX);
        let DistanceY = Math.abs(targetY - newY);

        let Speed = Math.round(30 * delta);
        if (DistanceX > DistanceY) Speed = Math.round(DistanceX * delta);
        else Speed = Math.round(DistanceY * delta);

        if (Speed < 1) Speed = 1;

        if (targetX > newX) {
            newX += Speed;
            if (newX > targetX) {
                newX = targetX;
            }
        } else if (targetX < newX) {
            newX -= Speed;
            if (newX < targetX) {
                newX = targetX;
            }
        }
        if (targetY > newY) {
            newY += Speed;
            if (newY > targetY) {
                newY = targetY;
            }
        } else if (targetY < newY) {
            newY -= Speed;
            if (newY < targetY) {
                newY = targetY;
            }
        }

        this.container.x = newX;
        this.container.y = newY;
        if (this.container.getChildByName("chat") != null) this.container.getChildByName("chat").y = -this.container.y;
        this.selectableContainer.x = this.container.x;
        this.selectableContainer.y = this.container.y;
    }

    setSelectedTile() {
        const floorTexture = BobbaEnvironment.getGame().engine.getTexture(ROOM_SELECTED_TILE);
        this.selectedTileSprite = new Sprite(floorTexture);
        this.selectedTileSprite.visible = false;
        this.container.addChild(this.selectedTileSprite);
    }

    setChatContainer(container: Container) {
        container.zIndex = calculateZIndexChat();
        container.name = "chat";
        container.y = -this.container.y;
        this.container.addChild(container);
    }

    addUserContainer(id: number, container: Container, shadowSprite: Sprite) {
        this.userSprites[id] = container;
        this.shadowSprites[id] = shadowSprite;
        this.container.addChild(container);
        this.container.addChild(shadowSprite);
    }

    addRoomItemContainerSet(id: number, containers: Container[]) {
        this.roomItemSprites[id] = containers;
        for (let container of containers) {
            this.container.addChild(container);
        }
    }

    addSelectableContainer(colorId: number, selectableContainers: Container[], selectableElement: Selectable) {
        this.selectableSprites[colorId] = selectableContainers;
        this.selectableItems[colorId] = selectableElement;

        for (let container of selectableContainers) {
            this.selectableContainer.addChild(container);
        }
    }

    startRoomItemMove(roomItem: RoomItem) {
        this.cancelRoomItemMove();
        this.movingItem = roomItem;
        this.movingItemPosition = { x: roomItem._x, y: roomItem._y, z: roomItem._z, rot: roomItem.rot };
        this.movingItem.startMovement();
    }

    cancelRoomItemMove() {
        if (this.movingItem != null) {
            const { x, y, z, rot } = this.movingItemPosition;
            this.movingItem.updatePosition(x, y, z, rot, false);
            this.movingItem.stopMovement();
            this.room.roomItemManager.cancelRoomItemMovement(this.movingItem);
        }
    }

    finishRoomItemMovement(globalX: number, globalY: number) {
        if (this.movingItem != null) {
            if (this.movingItem instanceof FloorItem) {
                const { x, y } = this.globalToTile(globalX, globalY);
                if (this.canPlaceFloorItem(x, y, this.movingItem)) {
                    const z = this.room.model.heightMap[x][y] - 1;
                    this.movingItem.updatePosition(x, y, z, this.movingItemPosition.rot, false);
                    this.room.roomItemManager.finishRoomItemMovement(this.movingItem);
                } else {
                    this.cancelRoomItemMove();
                }
            } else {
                const { x, y } = this.globalToLocal(globalX, globalY);
                if (this.canPlaceWallItem(globalX, globalY)) {
                    this.movingItem.updatePosition(x, y, 0, this.calculateWallDirection(globalX, globalY), false);
                    this.room.roomItemManager.finishRoomItemMovement(this.movingItem);
                } else {
                    this.cancelRoomItemMove();
                }
            }
            this.movingItem = null;
        }
    }

    isMovingRoomItem() {
        return this.movingItem != null;
    }

    updateMovingItem(globalX: number, globalY: number) {
        if (this.movingItem != null) {
            if (this.movingItem instanceof FloorItem) {
                const { x, y } = this.globalToTile(globalX, globalY);
                if (this.canPlaceFloorItem(x, y, this.movingItem)) {
                    const z = this.room.model.heightMap[x][y] - 1;
                    this.movingItem.updatePosition(x, y, z, this.movingItemPosition.rot, false);
                } else {
                    const local = this.globalToLocal(globalX, globalY);
                    this.movingItem.updatePosition(local.x, local.y, 0, this.movingItemPosition.rot, true);
                }
            } else {
                const { x, y } = this.globalToLocal(globalX, globalY);
                if (this.canPlaceWallItem(globalX, globalY)) {
                    this.movingItem.updatePosition(x, y, 0, this.calculateWallDirection(globalX, globalY), false);
                } else {
                    this.movingItem.updatePosition(x, y, 0, this.calculateWallDirection(globalX, globalY), true);
                }
            }
        }
    }

    calculateWallDirection(globalX: number, globalY: number): Direction {
        const local = this.globalToLocal(globalX, globalY);
        const wall = this.localToWall(local.x, local.y);
        wall.x--;

        for(let wallPoint of this.wallPoints) {
			let u = this.tileToLocal(wallPoint.x, wallPoint.y, wallPoint.z);
			let h = this.localToWall(u.x, u.y);
			if (wallPoint.rot === 4) {
				var d = wall.x - h.x;
                if (d < 1.1 && d > 0) return 4;
            }
        }
    
        return 2;
    }

    canPlaceWallItem(globalX: number, globalY: number): boolean {
        const local = this.globalToLocal(globalX, globalY);
        const wall = this.localToWall(local.x, local.y);
        const invertedWall = this.localToWall(-local.x, local.y);

        wall.x--;

        for(let wallPoint of this.wallPoints) {
            let h = this.tileToLocal(wallPoint.x, wallPoint.y, wallPoint.z);
				if (wallPoint.rot === 4) {
					let d = this.localToWall(h.x, h.y);
					let m = wall.x - d.x;
					let g = wall.y - d.y;
					let v = this.maxHeight - wallPoint.z - 1;
					if (m < 1.1 && m > 0 && g < -0.5 && g > -4 - v) return true;
				} else {
					let f = this.localToWall(-h.x, h.y);
					let p = f.x - invertedWall.x;
					let b = invertedWall.y - f.y;
					let y = this.maxHeight - wallPoint.z - 1;
					if (p < 1.1 && p > 0 && b < 0.5 && b > -3 - y) return true;
				}
        }

        return false;
    }

    canPlaceFloorItem(tileX: number, tileY: number, floorItem: FloorItem): boolean {
        const { model } = this.room;
        let maxX = tileX;
        let maxY = tileY;
        if (floorItem.baseItem != null) {
            const first = floorItem.baseItem.furniBase.offset.logic.dimensions.x;
            const second = floorItem.baseItem.furniBase.offset.logic.dimensions.y;
            if (first > 1) {
                if (floorItem.rot === 0 || floorItem.rot === 4) {
                    maxX += first - 1;
                }
                if (floorItem.rot === 2 || floorItem.rot === 6) {
                    maxY += first - 1;
                }
            }
            if (second > 1) {
                if (floorItem.rot === 0 || floorItem.rot === 4) {
                    maxY += first - 1;
                }
                if (floorItem.rot === 2 || floorItem.rot === 6) {
                    maxX += first - 1;
                }
            }
        }
        return model.isValidTile(tileX, tileY) && model.isValidTile(maxX, maxY);
    }

    removeSelectableContainer(colorId: number) {
        const containers = this.selectableSprites[colorId];
        if (containers != null) {
            for (let container of containers) {
                this.selectableContainer.removeChild(container);
            }
            delete (this.selectableSprites[colorId]);
        }

        const items = this.selectableItems[colorId];
        if (items != null) {
            delete (this.selectableItems[colorId]);
        }
    }

    removeRoomItemContainerSet(id: number) {
        const containers = this.roomItemSprites[id];
        if (containers != null) {
            for (let container of containers) {
                this.container.removeChild(container);
            }
            delete (this.roomItemSprites[id]);
        }
    }

    removeUserSprite(id: number) {
        const sprite = this.userSprites[id];
        const shadowSprite = this.shadowSprites[id];
        if (sprite != null) {
            this.container.removeChild(sprite);
            delete (this.userSprites[id]);
        }
        if (shadowSprite != null) {
            this.container.removeChild(shadowSprite);
            delete (this.shadowSprites[id]);
        }
    }

    _addWallSprite(texture: Texture | undefined, x: number, y: number, z: number, offsetX: number, offsetY: number, priority: number) {
        const currentSprite = new Sprite(texture);
        const localPos = this.tileToLocal(x, y, z);
        currentSprite.x = localPos.x + offsetX;
        currentSprite.y = localPos.y + offsetY;
        currentSprite.zIndex = calculateZIndex(x+1, y+1, 0, priority);
        this.wallSprites.push(currentSprite);
        this.container.addChild(currentSprite);
    }

    setWalls() {
        const { roomImager } = BobbaEnvironment.getGame();
        const model = this.room.model;
        let minY = model.maxX;

        for (let i = 0; i < model.maxX; i++) {
            for (let j = 0; j < model.maxY; j++) {
                const tile = model.heightMap[i][j];
                if (tile > this.maxHeight) {
                    this.maxHeight = tile;
                }
            }
        }

        for (let i = 0; i < model.maxX; i++) {
            for (let j = 0; j < model.maxY; j++) {
                const tile = model.heightMap[i][j];
                if ((model.doorX !== i || model.doorY !== j) && tile > 0 && j <= minY) {
                    if (minY > j) {
                        minY = j;
                    }
                    this._addWallSprite(roomImager.generateRoomWallR(this.maxHeight - tile), i, j + 1, this.maxHeight - 1, ROOM_WALL_R_OFFSET_X, ROOM_WALL_R_OFFSET_Y + 4, PRIORITY_WALL);
                    this.wallPoints.push({ x: i, y: j, z: tile - 1, rot: 4 });
                    break;
                }
            }
        }
        let minX = model.maxX;
        for (let j = 0; j < model.maxY; j++) {
            for (let i = 0; i < model.maxX; i++) {
                const tile = model.heightMap[i][j];
                if ((model.doorX !== i || model.doorY !== j) && tile > 0 && i <= minX) {
                    if (minX > i) {
                        minX = i;
                    }
                    if (j === model.doorY) {
                        this._addWallSprite(roomImager.generateRoomDoorL(), i, j, this.maxHeight - 1, ROOM_WALL_L_OFFSET_X, ROOM_WALL_L_OFFSET_Y + 4, PRIORITY_WALL);
                    } else if (j === model.doorY - 1) {
                        this._addWallSprite(roomImager.generateRoomDoorBeforeL(this.maxHeight - tile), i, j, this.maxHeight - 1, ROOM_WALL_L_OFFSET_X, ROOM_WALL_L_OFFSET_Y + 4, PRIORITY_WALL);
                        this.wallPoints.push({ x: i, y: j, z: tile - 1, rot: 2 });
                    } else {
                        this._addWallSprite(roomImager.generateRoomWallL(this.maxHeight - tile), i, j, this.maxHeight - 1, ROOM_WALL_L_OFFSET_X, ROOM_WALL_L_OFFSET_Y + 4, PRIORITY_WALL);
                        this.wallPoints.push({ x: i, y: j, z: tile - 1, rot: 2 });
                    }
                    break;
                }
            }
        }
    }

    setFloor() {
        const { roomTileTexture, roomStairLTexture, roomStairRTexture } = BobbaEnvironment.getGame().roomImager;

        this.floorSprites = [];
        const model = this.room.model;
        for (let i = 0; i < model.maxX; i++) {
            for (let j = 0; j < model.maxY; j++) {
                const tile = model.heightMap[i][j];
                if (tile > 0) {
                    if (model.isValidTile(i + 1, j) && model.heightMap[i + 1][j] < tile) {
                        const currentSprite = new Sprite(roomStairLTexture);
                        const localPos = this.tileToLocal(i, j, tile - 1);
                        currentSprite.x = localPos.x;
                        currentSprite.y = localPos.y;

                        currentSprite.zIndex = calculateZIndex(i, j, 0, model.doorX === i && model.doorY === j ? PRIORITY_DOOR_FLOOR : PRIORITY_FLOOR);
                        this.floorSprites.push(currentSprite);
                        this.container.addChild(currentSprite);
                    } else if (model.isValidTile(i - 1, j) && model.heightMap[i - 1][j] > tile) { }
                    else if (model.isValidTile(i, j - 1) && model.heightMap[i][j - 1] > tile) { }
                    else if (model.isValidTile(i, j + 1) && model.heightMap[i][j + 1] < tile) {
                        const currentSprite = new Sprite(roomStairRTexture);
                        const localPos = this.tileToLocal(i, j, tile - 1);
                        currentSprite.x = localPos.x - 34;
                        currentSprite.y = localPos.y + 0;

                        currentSprite.zIndex = calculateZIndex(i, j, 0, model.doorX === i && model.doorY === j ? PRIORITY_DOOR_FLOOR : PRIORITY_FLOOR);
                        this.floorSprites.push(currentSprite);
                        this.container.addChild(currentSprite);
                    }
                    else {
                        const currentSprite = new Sprite(roomTileTexture);
                        const localPos = this.tileToLocal(i, j, tile - 1);
                        currentSprite.x = localPos.x;
                        currentSprite.y = localPos.y;

                        currentSprite.zIndex = calculateZIndex(i, j, 0, model.doorX === i && model.doorY === j ? PRIORITY_DOOR_FLOOR : PRIORITY_FLOOR);
                        this.floorSprites.push(currentSprite);
                        this.container.addChild(currentSprite);
                    }
                }
            }
        }
    }

    tileToLocal(x: number, y: number, z: number): Point {
        return new Point((x - y) * ROOM_TILE_WIDTH, (x + y) * ROOM_TILE_HEIGHT - (z * ROOM_TILE_HEIGHT * 2));
    }

    globalToTile(x: number, y: number): Point {
        const first = this.globalToTileWithHeight(x, y, 0);
        const { model } = this.room;

        for (let z = 0; z < 32; z++) {
            const second = this.globalToTileWithHeight(x, y, z);
            if (model.isValidTile(second.x, second.y) && model.heightMap[second.x][second.y] == z + 1) {
                return second;
            }
        }
        return new Point(0, 0);
    }

    globalToTileWithHeight(x: number, y: number, z: number): Point {
        const offsetX = this.container.x;
        const offsetY = this.container.y - (z * ROOM_TILE_HEIGHT * 2);

        const xminusy = (x - ROOM_TILE_WIDTH - offsetX) / ROOM_TILE_WIDTH;
        const xplusy = (y - offsetY) / ROOM_TILE_HEIGHT;

        const tileX = Math.floor((xminusy + xplusy) / 2);
        const tileY = Math.floor((xplusy - xminusy) / 2);

        return new Point(tileX, tileY);
    }

    localToWall(localX: number, localY: number): Point {
        const x = localX / 32;
        const y = (localY / 32) - (localX / 64);

        return new Point(x, y);
    }

    globalToLocal(x: number, y: number): Point {
        const offsetX = this.container.x;
        const offsetY = this.container.y;
        return new Point(x - offsetX, y - offsetY);
    }

    handleMouseMovement = (mouseX: number, mouseY: number, isDrag: boolean) => {

        if (isDrag) {
            const diffX = Math.round(this.lastMousePositionX - mouseX);
            const diffY = Math.round(this.lastMousePositionY - mouseY);
            this.container.x -= diffX;
            this.container.y -= diffY;
            if (this.container.getChildByName("chat") != null) this.container.getChildByName("chat").y += diffY;
            this.selectableContainer.x = this.container.x;
            this.selectableContainer.y = this.container.y;
        } else {
            const colorId = this.getSelectableColorId(mouseX, mouseY);
            let selectable = null;
            if (colorId !== -1) {
                selectable = this.selectableItems[colorId];
                if (selectable != null) {
                    selectable.handleHover(colorId);
                }
            }
        }
        this.lastMousePositionX = Math.round(mouseX);
        this.lastMousePositionY = Math.round(mouseY);

        const { x, y } = this.globalToTile(mouseX, mouseY);
        this.updateSelectedTile(x, y);
        this.updateMovingItem(mouseX, mouseY);
    }

    getSelectableColorId(mouseX: number, mouseY: number): number {
        const pixels = BobbaEnvironment.getGame().engine.logicPixiApp.renderer.extract.pixels(this.getLogicStage());

        const bounds = this.getLogicStage().getBounds();
        const stageX = Math.floor(mouseX - bounds.x);
        const stageY = Math.floor(mouseY - bounds.y);
        const pos = (stageY * bounds.width + stageX) * 4;
        if (stageX >= 0 && stageY >= 0 && stageX <= bounds.width && stageY <= bounds.height) {
            const colorId = rgb2int(pixels[pos], pixels[pos + 1], pixels[pos + 2]);
            return colorId;
        }
        return -1;
    }

    handleMouseDown = (mouseX: number, mouseY: number, altKey: boolean): Selectable | null => {
        if (this.isMovingRoomItem()) {
            this.finishRoomItemMovement(mouseX, mouseY);
            return null;
        }
        const colorId = this.getSelectableColorId(mouseX, mouseY);
        let selectable = null;

        if (colorId !== -1) {
            selectable = this.selectableItems[colorId];

            if (selectable != null) {
                if (altKey) {
                    if (selectable instanceof RoomItem) {
                        this.startRoomItemMove(selectable);
                    }
                }
            }
        }
    }

    handleMouseClick = (mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean, altKey: boolean, focusChat: boolean): Selectable | null => {
        const { x, y } = this.globalToTile(mouseX, mouseY);
        const isValidTile = this.room.model.isValidTile(x, y);
        if (this.isMovingRoomItem()) {
            this.finishRoomItemMovement(mouseX, mouseY);
            return null;
        }
        const colorId = this.getSelectableColorId(mouseX, mouseY);
        let selectable = null;

        if (colorId !== -1) {
            selectable = this.selectableItems[colorId];

            if (selectable != null) {
                if (shiftKey) {
                    if (selectable instanceof FloorItem) {
                        selectable.rotate();
                    }
                } else if (ctrlKey) {
                    if (selectable instanceof RoomItem) {
                        selectable.pickUp();
                    }
                }

                selectable.handleClick(colorId);
            }
        }

        if (isValidTile) {
            BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestMovement(x, y));
        }
        if (focusChat) {
            BobbaEnvironment.getGame().uiManager.onFocusChat();
        }
        return selectable;
    }

    handleTouchMove = (mouseX: number, mouseY: number) => {
        mouseX = Math.floor(mouseX);
        mouseY = Math.floor(mouseY);
        this.handleMouseMovement(mouseX, mouseY, true);
    }

    handleTouchStart = (mouseX: number, mouseY: number) => {
        mouseX = Math.floor(mouseX);
        mouseY = Math.floor(mouseY);
        this.handleMouseMovement(mouseX, mouseY, false);
        const newSelectedItem = this.handleMouseClick(mouseX, mouseY, false, false, false, false);

        if (newSelectedItem === this.currentSelectedItem) {
            this.handleMouseDoubleClick(mouseX, mouseY);
        }
        this.currentSelectedItem = newSelectedItem;
    }

    handleMouseDoubleClick = (mouseX: number, mouseY: number) => {
        const { x, y } = this.globalToTile(mouseX, mouseY);
        const colorId = this.getSelectableColorId(mouseX, mouseY);
        const selectable = this.selectableItems[colorId];
        if (selectable != null) {
            selectable.handleDoubleClick(colorId);
        } else if (!this.room.model.isValidTile(x, y)) {
            this.centerCamera();
        }
    }

    updateSelectedTile(tileX: number, tileY: number) {
        if (this.selectedTileSprite != null) {
            const model = this.room.model;
            const visible = model.isValidTile(tileX, tileY);
            this.selectedTileSprite.visible = visible;
            let tileZ = 0;
            if (visible) {
                tileZ = model.heightMap[tileX][tileY] - 1;
                const localPos = this.tileToLocal(tileX, tileY, tileZ);
                this.selectedTileSprite.x = localPos.x + ROOM_SELECTED_TILE_OFFSET_X;
                this.selectedTileSprite.y = localPos.y + ROOM_SELECTED_TILE_OFFSET_Y;
                this.selectedTileSprite.zIndex = calculateZIndex(tileX, tileY, tileZ - 29, model.doorX === tileX && model.doorY === tileY ? PRIORITY_DOOR_FLOOR_SELECT : PRIORITY_FLOOR_SELECT);
            }

        }
    }

    tick(delta: number) {
        this.followCamera(delta);
    }

    getStage() {
        return this.container;
    }

    getLogicStage() {
        return this.selectableContainer;
    }

    calculateZIndexUser(x: number, y: number, z: number): number {
        const model = this.room.model;
        return _calculateZIndexUser(x, y, z, model.doorX === x && model.doorY === y ? PRIORITY_DOOR_FLOOR_PLAYER : PRIORITY_PLAYER);
    }
}

interface ContainerDictionary {
    [id: number]: Container;
}

interface ContainerArrayDictionary {
    [id: number]: Container[];
}

export interface Selectable {
    handleClick(id: number): void,
    handleDoubleClick(id: number): void,
    handleHover(id: number): void,
}

interface SelectableDictionary {
    [id: number]: Selectable;
}

export const calculateZIndex = (x: number, y: number, z: number, priority: number): number => {
    return ((x + y) * (COMPARABLE_X_Y) + (z * COMPARABLE_Z)) + (PRIORITY_MULTIPLIER * priority);
};

const _calculateZIndexUser = (x: number, y: number, z: number, priority: number): number => {
    return calculateZIndex(x, y, z + 0.11, priority);
};

export const calculateZIndexFloorItem = (x: number, y: number, z: number, zIndex: number): number => {
    let compareY = Math.round(zIndex / 1000);
    compareY = (compareY > 0) ? compareY : 0;
    const compareZ = (zIndex - (compareY * 1000)) / 100;

    return calculateZIndex(x, y + ((compareY < 0) ? 0 : compareY), z + compareZ, PRIORITY_ROOM_ITEM);
};

export const calculateZIndexWallItem = (id: number, x: number, y: number, zIndex: number, layerId: number): number => {
    return (id * COMPARABLE_Z) + layerId + (PRIORITY_MULTIPLIER * PRIORITY_WALL_ITEM);
};

export const rgb2int = (r: number, g: number, b: number) => {
    return (r << 16) + (g << 8) + (b);
};

export const calculateZIndexChat = () => PRIORITY_CHAT * PRIORITY_MULTIPLIER;

const PRIORITY_DOOR_FLOOR = 1;
const PRIORITY_DOOR_FLOOR_SELECT = 2;
const PRIORITY_DOOR_FLOOR_PLAYER = 2;

const PRIORITY_WALL = 3;
const PRIORITY_FLOOR = 4;
const PRIORITY_WALL_ITEM = 5;
const PRIORITY_FLOOR_SELECT = 6;
const PRIORITY_PLAYER = 6;
const PRIORITY_ROOM_ITEM = 6;
const PRIORITY_CHAT = 6;

const PRIORITY_MULTIPLIER = 10000000;
const COMPARABLE_X_Y = 1000;
const COMPARABLE_Z = 10;