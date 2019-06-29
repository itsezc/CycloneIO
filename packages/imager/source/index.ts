import './avatar/index.ts';

import Jimp from 'jimp';

Jimp.read('a.png').then((image0) => {
    Jimp.read('b.png').then(image1 => {

        // Merging two images
        image0.composite(image1, 0, 0);
        
        image0.write("newImage.png");
    })
})