export default class Size {

    private key: String;
    private prefix: String;
    private resizeFactor: number;
    private size: [number, number];

    constructor(key: String, prefix: String, resizeFactor: number, size: [number, number]){
        this.key = key;
        this.prefix = prefix;
        this.resizeFactor = resizeFactor;
        this.size = size;
    }

    public getKey(): String {
        return this.key;
    }

    public getPrefix(): String {
        return this.prefix;
    }

    public getResizeFactor(): number {
        return this.resizeFactor;
    }

    public getSize(): [number, number] {
        return this.size;
    }
}