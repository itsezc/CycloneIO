import Interface, { RegPoints } from './interface'
import ChatStyle from './interface';

export default class ChatBubble {
	chatStyles: ChatStyleDictionary

	constructor()
	{
		this.chatStyles = {}
	}

	initialise(): Promise<void> {
		const base = '/chat/1/base.png'
		const color = '/chat/1/avatar.png'
		const pointer = '/chat/1/pointer.png'
		const regPoints = '/chat/1/regpoints.json'
		return this.downloadChatStyle(regPoints, base, pointer, color).then((style: any) => {
			this.chatStyles[0] = style
		})
	}

	downloadChatStyle(
		regPoints: string,
		base: string,
		pointer: string,
		color: string
	): Promise<ChatStyle> {
		return this.fetchJsonAsync(regPoints)
			.then((regPointsData: any) => this.downloadImageAsync(base)
				.then((baseData: any) => this.downloadImageAsync(pointer)
					.then((pointerData: any) => this.downloadImageAsync(color)
						.then((colorData: any) => new ChatStyle(baseData, pointerData, colorData, (regPointsData as RegPoints))))))
	}

	fetchJsonAsync(URL: string): Promise<object> {
		return new Promise((resolve, reject) => {
			const options: RequestInit = {
				method: 'GET',
				mode: 'cors',
				cache: 'default'
			}

			fetch(URL, options)
				.then(response => response.json())
				.then(data => resolve(data))
				.catch(error => reject(error))
		})
	}

	downloadImageAsync(resourceName: string): Promise<HTMLImageElement> {
        let img = new Image();
        let d: Promise<HTMLImageElement> = new Promise((resolve, reject) => {
            img.onload = () => {
                //console.log("downloaded " + this.itemName + " -> " + this.resourceName);
                resolve(img);
            };
            img.onerror = () => {
                //console.log("NOT DOWNLOADED " + this.itemName + " -> " + this.resourceName);
                reject('Could not load image: ' + img.src);
            };
        });
        img.crossOrigin = "anonymous";
        img.src = resourceName;
        return d;
    }

	getStyle(id: number): ChatStyle {
        const style = this.chatStyles[id];
        if (style != null) {
            return style;
        }
        return this.chatStyles[0];
    }

	generateChatBubble(id: number, username: string, message: string, color: number, headImage: HTMLCanvasElement): HTMLCanvasElement {
        const style = this.getStyle(id);
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const FONT = "400 13px Ubuntu";
        const FONT_BOLD = "600 13px Ubuntu";
        if (tempCtx != null) {
            tempCtx.font = FONT_BOLD;
            tempCtx.textBaseline = "top";
            tempCtx.fillStyle = "black";

            const right_width = 5;
            const textMarginX = 32;
            const textMarginY = 6;
            const baseStartX = 24;

            const usernameWidth = Math.round(tempCtx.measureText(username + ": ").width);
            tempCtx.font = FONT;
            const messageWidth = Math.round(tempCtx.measureText(message).width + 5);
            const textWidth = usernameWidth + messageWidth;

            tempCanvas.width = textMarginX + textWidth + right_width;
            tempCanvas.height = style.base.height;

            for (let i = baseStartX; i < textMarginX + textWidth; i++) {
                tempCtx.drawImage(style.base, 32, 0, 1, style.base.height, i, 0, 1, style.base.height);
            }

            //Right side
            tempCtx.drawImage(style.base, style.base.width - right_width, 0, right_width, style.base.height, textMarginX + textWidth, 0, right_width, style.base.height);

            tempCtx.textBaseline = "top";
            tempCtx.fillStyle = "black";
            tempCtx.font = FONT_BOLD;

            tempCtx.fillText(username + ": ", textMarginX, textMarginY);

            tempCtx.font = FONT;
            tempCtx.fillText(message, textMarginX + usernameWidth, textMarginY);

            const colored = this.tintSprite(style.color, color)
            tempCtx.drawImage(colored, 0, 0);
            tempCtx.drawImage(headImage, -3, -7);
        }

        return tempCanvas;
    }

	int2rgb(color: number): RGB {
        return {
            r: ((color >> 16) & 0xff),
            g: ((color >> 8) & 0xff),
            b: ((color) & 0xff)
        }
    }

	tintSprite(
		img: HTMLCanvasElement | HTMLImageElement,
		color: number
	): HTMLCanvasElement | HTMLImageElement {
		let element = document.createElement('canvas')
		let c = element.getContext('2d')
		if (c === null) {
			return img
		}

		let rgb = this.int2rgb(color)
		let width = img.width
		let height = img.height 

		element.width = width
		element.height = height 

		c.drawImage(img, 0, 0)
		let imageData = c.getImageData(0, 0, width, height)
		for (let y = 0; y < height; y++) {
			let inpos = y * width * 4
			for (let x = 0; x < width; x++) {
				inpos++
				inpos++ 
				inpos++ 
				let pa = imageData.data[inpos++]
				if (pa !== 0) {
					imageData.data[inpos - 2] = Math.round(rgb.b * imageData.data[inpos - 2] / 255); //B
                    imageData.data[inpos - 3] = Math.round(rgb.g * imageData.data[inpos - 3] / 255); //G
                    imageData.data[inpos - 4] = Math.round(rgb.r * imageData.data[inpos - 4] / 255); //R
				}
			}
		}
		c.putImageData(imageData, 0, 0)
		return element
	}

}

interface ChatStyleDictionary {
    [id: number]: ChatStyle
}
interface RGB {
    r: number, g: number, b: number
}