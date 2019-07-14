import gd from 'node-gd';
import GuildBadgeRessource from './GuildBadgeRessource';

export default abstract class BadgePart {
    
    protected elementIndex: string;
    private colorIndex: string;
    private positionIndex: number;

    public constructor(elementIndex: string, colorIndex: string, positionIndex: number){
        this.elementIndex = elementIndex;
        this.colorIndex = colorIndex;
        this.positionIndex = positionIndex;
    }

    public getElementIndex(): string {
        return this.elementIndex;
    }

    public getDrawPosition(image: gd.Image): {x: number, y: number} {
        
        // #TODO: Constants ? Base width, base height
        let baseWidth = 39;
        let baseHeight = 39;

        let x: number = 0;
        let y: number = 0;
        let { width, height } = image;

        
        if(this.positionIndex == 1 || this.positionIndex == 4 || this.positionIndex == 7){
            x = (baseWidth - width) / 2 ;
        } else if(this.positionIndex == 2 || this.positionIndex == 5 || this.positionIndex == 8){
            x = (baseWidth - width);
        }

        if(this.positionIndex == 3 || this.positionIndex == 4 || this.positionIndex == 5){
            y = (baseHeight / 2) - (height / 2);
        } else if(this.positionIndex == 6 || this.positionIndex == 7 || this.positionIndex == 8){
            y = (baseHeight - height);
        }
        
        return {x , y}
    }
    
    abstract getResourcePath(guildBadgeRessource: GuildBadgeRessource): string;
    abstract getResourceData(guildBadgeRessource: GuildBadgeRessource): Object;

    private colorizeImage(image: gd.Image, colors: number[]): void {
        
        for(var x = 0; x < image.width; x++){
            for(var y = 0; y < image.height; y++){

                const colorAtPixel = image.getPixel(x, y);
                if(colorAtPixel == 0x000000 || image.alpha(colorAtPixel) != 0) continue;

                const greyScale = (image.red(colorAtPixel) + image.green(colorAtPixel) + image.blue(colorAtPixel)) / 3 / 0xff;
                
                const newColor = image.colorAllocate(
                    Math.round(colors[0] * greyScale), 
                    Math.round(colors[1] * greyScale), 
                    Math.round(colors[2] * greyScale)
                );

                image.setPixel(x, y, newColor)
            }
        }
    }

    public generate(guildBadgeRessource: GuildBadgeRessource): gd.Image {

        const imageData: Object = this.getResourceData(guildBadgeRessource);
        if(imageData === undefined) throw new Error('Ressource undefined : ' + this.elementIndex + ' on path : ' + this.getResourcePath(guildBadgeRessource));

        const resourcePath: string = this.getResourcePath(guildBadgeRessource) + '/';

        const colors: number[] = guildBadgeRessource.getColor(this.colorIndex);
        if(colors === undefined) throw new Error('Colors undefined with key : ' + this.colorIndex);
        
        if(imageData.hasOwnProperty('image')) {

            let image = gd.createFromPng(resourcePath + imageData.image);
            image.saveAlpha(1);
            
            this.colorizeImage(image, colors);

            return image;
        }


        if(!imageData.hasOwnProperty('layers'))
            throw new Error(`BadgePart with id [${this.elementIndex}] doesn't have image and layers data`);


        const { layers } = imageData;
        
        let image: gd.Image = gd.createFromPng(resourcePath + layers[0].image);
        this.colorizeImage(image, colors);

        image.saveAlpha(1);
        
        for(let l = 1; l < layers.length; l++){

            const layerImage = gd.createFromPng(resourcePath + layers[l].image);
            layerImage.copy(image, 0, 0, 0, 0, layerImage.width, layerImage.height);
        }

        return image;
    }
}