import { Container } from 'inversify'

import ISocketManager from '../communication/ISocketManager'
import SocketManager from '../communication/SocketManager'

import IEventsManager from '../communication/events/IEventsManager'
import EventsManager from '../communication/events/EventsManager'

import IRoomManager from "../rooms/IRoomManager"
import RoomManager from "../rooms/RoomManager"
import Habbo from "../Habbo";

const HabboContainer = new Container()

HabboContainer.bind<Habbo>(Habbo).toSelf().inSingletonScope()
HabboContainer.bind<ISocketManager>('ISocketManager').to(SocketManager).inSingletonScope()
HabboContainer.bind<IEventsManager>('IEventsManager').to(EventsManager).inSingletonScope()
HabboContainer.bind<IRoomManager>('IRoomManager').to(RoomManager).inSingletonScope()

export default HabboContainer
