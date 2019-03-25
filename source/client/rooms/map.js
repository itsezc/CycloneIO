export default function GameMap(scene, gameMapTiles) {
    this.scene = scene;
    this.gameMapTiles = gameMapTiles;
}

/**
 * The map depth
 */
GameMap.prototype.MapDepth = {
    DOOR_TILE: 0,
    DOOR_HOVER_TILE: 1,
    DOOR_PLAYER: 2,
    WALL: 3,
    TILE: 4,
    HOVER_TILE: 5,
    PLAYER: 6,
};

/**
 * Converts the incoming 3D coordinates into cartesian coordinates
 * @param {number} isometricCoordinates - The isometric coordinates, supplying the tile it will take the coordinates of the tile which are isometric
 */
GameMap.prototype.isometricToCartesian = function (isometricCoordinates) {
    var cartesianCoordinates = new Phaser.Geom.Point();
    cartesianCoordinates.x = (2 * isometricCoordinates.y + isometricCoordinates.x) / 2;
    cartesianCoordinates.y = (2 * isometricCoordinates.y - isometricCoordinates.x) / 2;
    return (cartesianCoordinates);
};

/**
 * Converts the incoming 2D coordinates into isometric coordinates
 * @param {number} cartesianCoordinates - The cartesian coordinates
 */
GameMap.prototype.cartesianToIsometric = function (cartesianCoordinates) {
    var isometricCoordinates = new Phaser.Geom.Point();
    isometricCoordinates.x = cartesianCoordinates.x - cartesianCoordinates.y;
    isometricCoordinates.y = (cartesianCoordinates.x + cartesianCoordinates.y) / 2;
    return (isometricCoordinates);
};

/**
 * Converts the incoming isometric coordinates into map coordinates
 * @param {number} isometricCoordinates - The isometric coordinates, supplying the tile it will take the coordinates of the tile which are isometric
 */
GameMap.prototype.isometricToMap = function (isometricCoordinates) {
    var mapCoordinates = new Phaser.Geom.Point();
    mapCoordinates.x = Math.floor(this.isometricToCartesian(isometricCoordinates).x / 32);
    mapCoordinates.y = Math.floor(this.isometricToCartesian(isometricCoordinates).y / 32);
    return (mapCoordinates);
};

/**
 * Converts the incoming map coordinates into isometric coordinates
 * @param {number} mapCoordinates - The given map coordinates
 */
GameMap.prototype.mapToIsometric = function (mapCoordinates) {
    var isometricCoordinates = new Phaser.Geom.Point();
    isometricCoordinates.x = (mapCoordinates.x - mapCoordinates.y) * 32;
    isometricCoordinates.y = (mapCoordinates.x + mapCoordinates.y) * 16;
    return (isometricCoordinates);
};

/**
 * Gets the game map
 */
GameMap.prototype.getMapTiles = function () {
    return this.gameMapTiles;
};

/**
 * Gets a specified row of the game map
 * @param {number} column - The row to look for
 */
GameMap.prototype.getMapRow = function (row) {
    return this.gameMapTiles[row];
};

/**
 * Gets a specified column of the game map
 * @param {number} column - The column to look for
 */
GameMap.prototype.getMapColumn = function (column) {
    return this.gameMapTiles.map((row) => row[column]);
};

/**
 * Gets all the game map columns
 */
GameMap.prototype.getMapColumns = function () {
    var mapColumns = [];
    this.gameMapTiles.forEach(row => mapColumns.push(row.length));
    return Math.max.apply(Math, mapColumns);
};
