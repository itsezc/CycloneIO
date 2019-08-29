import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";
import RoomModel from "../../../rooms/RoomModel";

export default class HandleHeightMap implements IIncomingEvent {
    handle(request: ServerMessage) {
        const cols = request.popInt();
        const rows = request.popInt();
        const doorX = request.popInt();
        const doorY = request.popInt();

        const heightmap: number[][] = [];

        for (let i = 0; i < cols; i++) {
            heightmap.push([]);
            for (let j = 0; j < rows; j++) {
                heightmap[i].push(request.popInt());
            }
        }

        const model = new RoomModel(cols, rows, doorX, doorY, heightmap);
        BobbaEnvironment.getGame().handleHeightMap(model);
    }

    _parse(input: string): number { // + 1
        switch (input) {
            case 'y':
            case 'x':
            case 'z':
                return -1;
            case '0':
                return 0;
            case '1':
                return 1;
            case '2':
                return 2;
            case '3':
                return 3;
            case '4':
                return 4;
            case '5':
                return 5;
            case '6':
                return 6;
            case '7':
                return 7;
            case '8':
                return 8;
            case '9':
                return 9;
            case 'a':
                return 10;
            case 'b':
                return 11;
            case 'c':
                return 12;
            case 'd':
                return 13;
            case 'e':
                return 14;
            case 'f':
                return 15;
            case 'g':
                return 16;
            case 'h':
                return 17;
            case 'i':
                return 18;
            case 'j':
                return 19;
            case 'k':
                return 20;
            case 'l':
                return 21;
            case 'm':
                return 22;
            case 'n':
                return 23;
            case 'o':
                return 24;
            case 'p':
                return 25;
            case 'q':
                return 26;
            case 'r':
                return 27;
            case 's':
                return 28;
            case 't':
                return 29;
            case 'u':
                return 30;
            case 'v':
                return 31;
            case 'w':
                return 32;
            default:
                return 0;
        }
    }
}