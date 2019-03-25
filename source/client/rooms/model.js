export default function RoomModel(scene, gameMap) {
  this.scene = scene;
  this.gameMap = gameMap;
}

/**
 * The tile types
 */
RoomModel.prototype.TileTypes = {
  TILE: 0,
  NONE: 1,
  WALL_LEFT: 2,
  WALL_RIGHT: 3,
  WALL_CORNER: 4,
  DOOR: 5,
};

/**
 * Creates a room
 * @param {object} room - The room data
 */
RoomModel.prototype.createRoom = function (room) {
  this.room = room;

  this.tiles = this.scene.add.group();
  this.wallsLeft = this.scene.add.group();
  this.wallsRight = this.scene.add.group();

  var i, j;
 this.gameMap.getMapColumns();

  for (i = 0; i < this.gameMap.getMapTiles().length; i++) {
    for (j = 0; j < this.gameMap.getMapColumns(); j++) {
      var x = j * 32;
      var y = i * 32;

      var cartesianCoordinates = new Phaser.Geom.Point(x, y);
      var isometricCoordinates = this.gameMap.cartesianToIsometric(cartesianCoordinates);

      this.setMap(new Phaser.Geom.Point(
        isometricCoordinates.x,
        isometricCoordinates.y
      ), this.gameMap.getMapTiles()[i][j]);
    }
  }

  this.tiles.getChildren().forEach(tile => {
    tile.setInteractive({
      pixelPerfect: true
    });

    tile.on("pointerover", () => {
      this.placeHoverTile(tile)
    })

    tile.on("pointerup", () => {
      if (!this.scene.cameraScroll) {
        var x = this.gameMap.isometricToMap(tile).x;
        var y = this.gameMap.isometricToMap(tile).y;

        console.info(`x: ${x}, y: ${y}`);

        this.scene.socket.emit('tileClick', this.gameMap.getMapTiles(), {x, y});
      }
    });
  });

  this.wallsLeft.getChildren().forEach(wall => {
    if (this.wallsLeft.getChildren().indexOf(wall) < this.wallsLeft.getLength() - 1)
      wall.setCrop(9, 0, wall.width, wall.height);
  });
};

/**
 * Sets the map according to the given tile coordinates and type
 * @param {number} tileCoordinates - The coordinates of the given tile in the map
 * @param {number} tileType - The type of the given tile
 */
RoomModel.prototype.setMap = function (tileCoordinates, tileType) {
  switch (tileType) {
    case this.TileTypes.TILE:
      this.placeTile(tileCoordinates);
      break;

    case this.TileTypes.WALL_LEFT:
      this.placeTile(tileCoordinates);

      if (!this.room.hiddenWalls)
        this.placeWallLeft(tileCoordinates);
      break;

    case this.TileTypes.WALL_RIGHT:
      this.placeTile(tileCoordinates);

      if (!this.room.hiddenWalls)
        this.placeWallRight(tileCoordinates);
      break;

    case this.TileTypes.WALL_CORNER:
      this.placeTile(tileCoordinates);

      if (!this.room.hiddenWalls) {
        this.placeWallLeft(tileCoordinates);
        this.placeWallRight(tileCoordinates);
      }
      break;

    case this.TileTypes.DOOR:
      this.placeTile(tileCoordinates, !this.room.hiddenWalls ? true : false);

      if (!this.room.hiddenWalls)
        this.placeDoor(tileCoordinates);
      break;
  }
};

/**
 * Places a tile in the map
 * @param {number} tileCoordinates - The tile coordinates
 * @param {boolean} doorTile - Sets where the tile is a door tile or not
 */
RoomModel.prototype.placeTile = function (tileCoordinates, doorTile) {
  var tile = this.tiles.create(
    tileCoordinates.x,
    tileCoordinates.y,
    "tile"
  ).setOrigin(0).setDepth(!doorTile ? this.gameMap.MapDepth.TILE : this.gameMap.MapDepth.DOOR_TILE);

  if (doorTile)
    tile.setCrop(32, 0, tile.width, tile.height);
};

/**
 * Places a hover tile around the selected tile
 * @param {object} tile - The current tile
 */
RoomModel.prototype.placeHoverTile = function (tile) {
  var hoverTile = this.tiles.create(
    tile.x - (this.gameMap.isometricToMap(tile).x !== -1 || this.room.hiddenWalls ? 2 : 0),
    tile.y - (this.gameMap.isometricToMap(tile).x !== -1 || this.room.hiddenWalls ? 2 : 3),
    "hover_tile"
  ).setOrigin(0).setDepth(this.gameMap.isometricToMap(tile).x !== -1 || this.room.hiddenWalls ? this.gameMap.MapDepth.HOVER_TILE : this.gameMap.MapDepth.DOOR_HOVER_TILE);

  if (this.gameMap.isometricToMap(tile).x === -1 && !this.room.hiddenWalls)
    hoverTile.setCrop(32, 0, hoverTile.width, hoverTile.height);

  tile.on("pointerout", () => {
    hoverTile.destroy();
  });
};

/**
 * Places a wall left according to the given tile
 * @param {number} tileCoordinates The tile coordinates
 */
RoomModel.prototype.placeWallLeft = function (tileCoordinates) {
  this.wallsLeft.create(
    tileCoordinates.x + 12,
    tileCoordinates.y - 50,
    "wall_left")
    .setDepth(this.gameMap.MapDepth.WALL);
};

/**
 * Places a wall right according to the given tile
 * @param {number} tileCoordinates The tile coordinates
 */
RoomModel.prototype.placeWallRight = function (tileCoordinates) {
  this.wallsRight.create(
    tileCoordinates.x + 54,
    tileCoordinates.y - 50,
    "wall_right")
    .setDepth(this.gameMap.MapDepth.WALL);
};

/**
 * Places a door according to the given tile
 * @param {number} tileCoordinates The tile coordinates
 */
RoomModel.prototype.placeDoor = function (tileCoordinates) {
  this.scene.add.image(
    tileCoordinates.x + 48,
    tileCoordinates.y - 37,
    "door")
    .setDepth(this.gameMap.MapDepth.WALL);
};
