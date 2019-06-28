import Size from './size';

export default class Sizes {

    static readonly SMALL = new Size("s", "sh", 1, [33, 56]);
    static readonly NORMAL = new Size("m", "h", 1, [64, 110]);
    static readonly LARGE = new Size("l", "h", 2, [64, 110]);
    static readonly XLARGE = new Size("xl", "h", 3, [64, 110]);

    
}