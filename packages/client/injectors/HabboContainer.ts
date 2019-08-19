import { Container } from 'inversify'

import ISocketManager from '../communication/ISocketManager'
import SocketManager from '../communication/SocketManager'
import IEventsManager from '../communication/events/IEventsManager';
import EventsManager from '../communication/events/EventsManager';

const HabboContainer = new Container()

HabboContainer.bind<ISocketManager>('ISocketManager').to(SocketManager).inSingletonScope()
HabboContainer.bind<IEventsManager>('IEventsManager').to(EventsManager).inSingletonScope()

export default HabboContainer