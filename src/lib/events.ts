import { EventEmitter } from 'events';

// A simple global emitter for SSE live events (in-memory for MVP, redis for prod)
export const liveEventEmitter = new EventEmitter();
