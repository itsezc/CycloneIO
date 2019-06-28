import Jimp from 'jimp';

var image0 = 'ressources/source/clothes/0.jpg';
var image1 = 'ressources/source/clothes/1.jpg';

Jimp.read(image0).then((image0jimp => {
    Jimp.read(image1).then(image1jimp => {

        image0jimp.composite(image1jimp, 0, 0, 
            {
                mode: Jimp.BLEND_SOURCE_OVER,
                opacitySource: 0.5,
                opacityDest: 0.9
            }
        );

        image0jimp.write('test.png');
    });
})).catch(er => console.log(er))