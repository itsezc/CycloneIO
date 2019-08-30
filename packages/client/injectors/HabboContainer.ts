import { Container } from 'inversify'

import ISocketManager from '../communication/ISocketManager'
import SocketManager from '../communication/SocketManager'

import IEventsManager from '../communication/events/IEventsManager'
import EventsManager from '../communication/events/EventsManager'

import IRoomManager from '../rooms/IRoomManager'
import RoomManager from '../rooms/RoomManager'

import ICullManager from '../rooms/cull/ICullManager'
import CullManager from '../rooms/cull/CullManager'

import Habbo from '../Habbo'

const HabboContainer = new Container()

HabboContainer.bind<Habbo>(Habbo).toSelf().inSingletonScope()
HabboContainer.bind<ISocketManager>('ISocketManager').to(SocketManager).inSingletonScope()
HabboContainer.bind<IEventsManager>('IEventsManager').to(EventsManager).inSingletonScope()
HabboContainer.bind<IRoomManager>('IRoomManager').to(RoomManager).inSingletonScope()
HabboContainer.bind<ICullManager>('ICullManager').to(CullManager).inSingletonScope()

export default HabboContainer
