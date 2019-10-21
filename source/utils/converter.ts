export class Converter{
    public static cartesianToIsometric(points:any){
        return {x : points.x - points.y, y : (points.x + points.y) / 2}
    }
}