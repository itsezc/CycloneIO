const int2rgb = (color: number): RGB => {
    return {
        r: ((color >> 16) & 0xff),
        g: ((color >> 8) & 0xff),
        b: ((color) & 0xff)
    }
}

const hex2rgb = (hex: string): null | RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

interface RGB {
    r: number, g: number, b: number
}

function isNumber(value: string | number): boolean
{
   return ((value != null) && !isNaN(Number(value.toString())));
}

export const tintSprite = (img: HTMLCanvasElement | HTMLImageElement, color: number, alpha: number): HTMLCanvasElement | null => {
    let element = document.createElement('canvas');
    let c = element.getContext("2d");
    if (c == null)
        return null;

    let rgb = int2rgb(color);

    let width = img.width;
    let height = img.height;

    element.width = width;
    element.height = height;

    c.drawImage(img, 0, 0);
    let imageData = c.getImageData(0, 0, width, height);
    for (let y = 0; y < height; y++) {
        let inpos = y * width * 4;
        for (let x = 0; x < width; x++) {
            inpos++; //r
            inpos++; //g
            inpos++; //b
            let pa = imageData.data[inpos++];
            if (pa !== 0) {
                imageData.data[inpos - 1] = alpha; //A
                imageData.data[inpos - 2] = Math.round(rgb.b * imageData.data[inpos - 2] / 255); //B
                imageData.data[inpos - 3] = Math.round(rgb.g * imageData.data[inpos - 3] / 255); //G
                imageData.data[inpos - 4] = Math.round(rgb.r * imageData.data[inpos - 4] / 255); //R
            }
        }
    }
    c.putImageData(imageData, 0, 0);
    return element;
}

export const flipImage = (img: HTMLCanvasElement | HTMLImageElement): HTMLCanvasElement | null => {
    let element = document.createElement('canvas');
    let c = element.getContext("2d");
    if (c == null)
        return null;

    let width = img.width;
    let height = img.height;
    element.width = width;
    element.height = height;

    c.save();
    c.scale(-1, 1);
    c.drawImage(img, 0, 0, width * -1, height);
    c.restore();

    return element;
}

export const resizeImage = (img: HTMLCanvasElement | HTMLImageElement, size: number): HTMLCanvasElement | null => {
    let element = document.createElement('canvas');
    let c = element.getContext("2d");
    if (c == null)
        return null;

    let width = img.width * size;
    let height = img.height * size;
    element.width = width;
    element.height = height;

    c.save();
    c.scale(size, size);
    c.drawImage(img, 0, 0);
    c.restore();

    return element;
}

export const downloadImageAsync = (Url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => { resolve(img); };
        img.onerror = () => { reject('Could not load image: ' + img.src); };
        if (Url == undefined)
            reject("image undefined: " + Url);

        img.crossOrigin = "anonymous";
        img.src = Url;
    });
}