import IEvent from './IEvent'

export default interface IEventsManager {
	events: Map<string, IEvent>
}
