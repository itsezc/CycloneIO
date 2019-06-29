import Avatar from './Avatar';
import AvatarDataLoader from './utils/AvatarDataLoader';

(async () => {

    var avatarDataLoader = new AvatarDataLoader();
    await avatarDataLoader.load();
    
    // hd-180-1.ch-255-66.lg-280-110.sh-305-62.ha-1012-110.hr-828-61
    // &action=std&gesture=std&direction=2&head_direction=2
    var avatar = new Avatar("hd-180-1.ch-255-66.lg-280-110.sh-305-62.ha-1012-110.hr-828-61");
    avatar.generate(avatarDataLoader);
})();
