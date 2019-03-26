class RoomMap {
	constructor(map, doorX, doorY) {
		this.map = map
		this.doorX = doorX
		this.doorY = doorY
	}

	get rows() {
		return this.map.length
	}

	get columns() {
		var rows = []
		this.map.forEach(row => rows.push(row.length))
		return Math.max.apply(Math, rows)
	}
}

export default RoomMap
