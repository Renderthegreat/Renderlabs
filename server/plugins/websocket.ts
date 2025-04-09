import { WebSocketServer, WebSocket } from "ws";
import { RenderlabsConnection } from "~/assets/ts/connection";
import { ManagerEvent } from "~/assets/ts/manager";
import { route } from "~/assets/ts/route";

export default defineNitroPlugin((nitroApp) => {
  const wss = new WebSocketServer({ port: 3001 })

  wss.on('connection', (ws) => {
    const connection = new RenderlabsConnection(ws);
    connection.recieveEvent(async function (request) {
      try {
        route(request).then(async (response) => {
          await connection.sendEvent(response);
        });
      } catch (err) {
        console.log(err);
      }
    });
  });

  console.log('🌐 WebSocket server running on ws://localhost:3001');
});