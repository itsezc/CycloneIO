import { throws } from "assert"

export class Path {
    visited: any = []

    grid: any

    save_grid: any

    c_f_d: any = {}

    came_from: any = {}

    added_to_patch: any = {}

    path: any = []

    origin: any

    destination: any

    frontier: any = []

    constructor(grid: any, origin: any, destination: any) {
        this.grid = grid
        this.save_grid = grid
        this.origin = JSON.stringify(origin)
        this.destination = JSON.stringify(destination)
        console.log(this.destination)
        this.frontier.push(this.origin)
        this.came_from[JSON.stringify(this.frontier[0])] = true
        this.initializeMap()
        console.log(this.came_from)
        this.findPath()

    }

    findPath() {
        while(this.destination != this.origin){
            console.log(this.destination, ' Hello d', this.origin, this.came_from[this.destination])
            this.path.push(JSON.parse(this.destination))
            if(this.came_from[this.destination] != undefined){
                this.destination = JSON.stringify(this.came_from[this.destination].coord)
                console.log("HAHAHA", this.came_from[this.destination])
            }else{
                
                break
            }
        }
    }

    initializeMap() {
        while (true) {
            let current = this.frontier[0]
            if (current == undefined) { break }
            if(typeof(current) == 'string'){current = JSON.parse(current)}

            let neighbors = this.neighbors(current)
            for (let next in neighbors) {
                if (neighbors[next] == undefined) { continue }
                if (this.came_from[JSON.stringify(neighbors[next])] == undefined) {
                    let coord = neighbors[next]
                    if (this.grid[coord.y][coord.x] != 'x') {
                        let value = this.grid[coord.y][coord.x]
                        let currentValue: any = this.grid[current.y][current.x]
                        if (value == currentValue || value == currentValue + 1 || value == currentValue - 1) {
                           
                            this.frontier.push(neighbors[next])
                            this.came_from[JSON.stringify(neighbors[next])] = { coord: current, text: next == 'north' ? "^" : next == 'south' ? "v" : next == 'east' ? ">" : "<" }
                        }
                    }
                }
            }
            this.frontier.shift()
        }
    }

    neighbors(node: any) {
        let neighbor: any = {
            north: undefined,east: undefined, south: undefined,
            //south_east: undefined,
            
            
            
            //north_east: undefined,
            
            west: undefined,
            
            
           
            
            //north_west: undefined,
            //south_west: undefined,
            
            
             
            
           
            
            
            
            
            
        }

        neighbor.north = this.grid[node.y - 1] != undefined ? { x: node.x, y: node.y - 1 } : undefined
        neighbor.north_east = this.grid[node.y - 1] != undefined && this.grid[node.y - 1][node.x + 1] != undefined ? { x: node.x + 1, y: node.y - 1 } : undefined
        neighbor.north_west = this.grid[node.y - 1] != undefined && this.grid[node.y - 1][node.x - 1] != undefined ? { x: node.x - 1, y: node.y - 1 } : undefined
        neighbor.south = this.grid[node.y + 1] != undefined ? { x: node.x, y: node.y + 1 } : undefined
        neighbor.south_east = this.grid[node.y + 1] != undefined && this.grid[node.y + 1][node.x + 1] != undefined ? { x: node.x + 1, y: node.y + 1 } : undefined
        neighbor.south_west = this.grid[node.y + 1] != undefined && this.grid[node.y + 1][node.x - 1] != undefined ? { x: node.x - 1, y: node.y + 1 } : undefined
        neighbor.east = this.grid[node.y][node.x + 1] != undefined ? { x: node.x + 1, y: node.y } : undefined
        neighbor.west = this.grid[node.y][node.x - 1] != undefined ? { x: node.x - 1, y: node.y } : undefined

        if(node.y != this.destination.y){
            if (node.y < this.destination.y){
                if(node.x < this.destination.x){
                    neighbor.east = undefined
                }else if(node.x > this.destination.x){
                    neighbor.west = undefined
                }
            }
        }

        for (let direction in neighbor) {
            let coord = neighbor[direction]
            let tile = 'a'
            if (coord != undefined) {
                if (tile == 'x') {
                    neighbor[direction] = undefined
                }
            }

        }
        return neighbor
    }
}
