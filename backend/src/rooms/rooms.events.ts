import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RoomsEvents {
    constructor(private emitter: EventEmitter2) { }

    emitRoomCreated() {
        this.emitter.emit('rooms.changed');
    }

    emitRoomDeleted() {
        this.emitter.emit('rooms.changed');
    }
}