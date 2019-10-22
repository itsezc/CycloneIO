export class Converter{
    static cartesianToIsometric(points){
        return {x : points.x - points.y, y : (points.x + points.y) / 2}
    }
}