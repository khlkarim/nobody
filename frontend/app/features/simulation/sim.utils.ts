import type { Socket } from "socket.io-client";
import { Events, type BodyResponseSchema, type Vec2Schema } from "./sim.schema";

export function update(
  deltatime: number,
  container: Vec2Schema,
  mine: BodyResponseSchema[],
  all: BodyResponseSchema[],
) {
  for (let i = 0; i < mine.length; i++) {
    const pi = mine[i].position;
    const vi = mine[i].velocity;
    const ai = { x: 0, y: 0 };

    for (let j = 0; j < all.length; j++) {
      if (mine[i].id === all[j].id) {
        continue;
      }

      const pj = all[j].position;
      const d = { x: pj.x - pi.x, y: pj.y - pi.y };
      const distance2 = Math.pow(d.x, 2) + Math.pow(d.y, 2);

      ai.x += (all[j].mass / distance2) * d.x;
      ai.y += (all[j].mass / distance2) * d.y;
    }

    vi.x += deltatime * ai.x;
    vi.y += deltatime * ai.y;

    const newP = {
      x: pi.x + deltatime * vi.x,
      y: pi.y + deltatime * vi.y,
    }

    if (newP.x + mine[i].radius > container.x / 2 || newP.x - mine[i].radius < -container.x / 2) {
      vi.x *= -1;
    }

    if (newP.y + mine[i].radius > container.y / 2 || newP.y - mine[i].radius < -container.y / 2) {
      vi.y *= -1;
    }

    pi.x += deltatime * vi.x;
    pi.y += deltatime * vi.y;

    mine[i].position = pi;
    mine[i].velocity = vi;
  }

  return mine;
}

export function broadcast(
  socket: Socket,
  roomId: string,
  mine: BodyResponseSchema[]
) {
  socket.emit(Events.SIM_STATE_UPDATE_BODY, {
    roomId,
    bodies: mine
  })
}
