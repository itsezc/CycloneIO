import { injectable } from "inversify";

import IEventsManager from "./IEventsManager"
import IEvent from "./IEvent"

import { PlayerJoinedEvent } from "./eventIndex"

@injectable()
export default class EventsManager implements IEventsManager {
    public events: Map<string, IEvent>

    constructor() {
        this.events = new Map<string, IEvent>()

        this.fetchEvents()
    }

    private fetchEvents(): void {
        const events = this.getEvents()

        for (const entry of Object.entries(events)) {
            this.events.set(entry[0], new entry[1])
        }
    }

    private getEvents() {
        return {
            playerJoined: PlayerJoinedEvent
        }
    }
}